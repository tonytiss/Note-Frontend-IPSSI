<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" placeholder="Email" type="email" required />
    <input v-model="password" placeholder="Mot de passe" type="password" required />
    <button>Connexion</button>
  </form>

  <!-- Affiche uniquement le message -->
  <p v-if="responseMessage" style="margin-top: 1rem; color: green;">
    {{ responseMessage }}
  </p>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const responseMessage = ref(''); // Pour afficher uniquement le message

const store = useUserStore();
const router = useRouter();
const handleLogin = async () => {
  try {
    const data = await store.login(email.value, password.value);
    responseMessage.value = data.message || 'Connexion réussie !'

    // Redirection après 1.5 seconde
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500);
  } catch (error) {
    const errorMsg =
      error?.message ||
      (error?.response?.data?.message ?? 'Erreur de connexion')
    responseMessage.value = `❌ ${errorMsg}`
  }
}
</script>