<template>
  <div class="dashboard-container">

    <div class="header">
      <h1>Tableau de bord</h1>
      <button class="logout-button" @click="logout">Déconnexion</button>
    </div>

    <p>Bienvenue dans le tableau de bord utilisateur.</p>

    <!-- ✅ Formulaire pour ajouter une note -->
    <form @submit.prevent="addNote" class="note-form">
      <input v-model="newNoteTitle" placeholder="Titre de la note" required />
      <textarea v-model="newNoteContent" placeholder="Contenu de la note" required></textarea>
      <button type="submit">Ajouter une note</button>
    </form>

    <div v-if="loading">Chargement des données...</div>
    <div v-else-if="error" style="color: red;">Erreur : {{ error }}</div>
    <div v-else>
      <h2>Notes de l'utilisateur :</h2>
      <ul>
        <li v-for="note in userData" :key="note.id" class="note">
          <h3>{{ note.titre }}</h3>
          <p>{{ note.contenu }}</p>
          <small>Dernière modification : {{ formatDate(note.updatedAt) }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const userData = ref([])
const loading = ref(true)
const error = ref(null)

const newNoteTitle = ref('')
const newNoteContent = ref('')

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    return null
  }
}

const fetchNotes = async () => {
  try {
    const token = localStorage.getItem('token')
    const payload = parseJwt(token)

    if (!payload || !payload.id) {
      throw new Error('Token invalide ou ID utilisateur manquant.')
    }

    const userId = payload.id
    const response = await axios.get(`http://localhost:3000/api/v1/notes/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    userData.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erreur inconnue'
  }
}

onMounted(async () => {
  loading.value = true
  await fetchNotes()
  loading.value = false
})

// ✅ Fonction d'ajout de note
const addNote = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    error.value = 'Utilisateur non connecté.'
    return
  }

  try {
    await axios.post('http://localhost:3000/api/v1/notes', {
      titre: newNoteTitle.value,
      contenu: newNoteContent.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    newNoteTitle.value = ''
    newNoteContent.value = ''
    await fetchNotes() // 🔄 Rafraîchir la liste des notes
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l’ajout de la note.'
  }
}

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR')
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.logout-button:hover {
  background-color: #c0392b;
}

.note {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.note-form input,
.note-form textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.note-form button {
  align-self: flex-start;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.note-form button:hover {
  background-color: #2980b9;
}
</style>


