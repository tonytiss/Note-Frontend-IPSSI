<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>Dashboard</h1>
      <button @click="logout" class="logout-button">Se déconnecter</button>
    </div>

    <p>Bienvenue dans le tableau de bord utilisateur.</p>

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
import { useRouter } from 'vue-router' // ← Ajout

const router = useRouter()

const userData = ref([])
const loading = ref(true)
const error = ref(null)

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    return null
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null

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
  } finally {
    loading.value = false
  }
})

// ✅ Fonction de déconnexion
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
</style>

