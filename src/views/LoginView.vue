<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Mot de passe" type="password" required />
      <button>Connexion</button>

      <p v-if="responseMessage" class="message">
        {{ responseMessage }}
      </p>
    </form>

    <!-- ✅ Bouton en bas de page -->
    <div class="bottom-button">
      <button @click="goToRegister">Créer un compte</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const responseMessage = ref('');

const store = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    const data = await store.login(email.value, password.value);
    responseMessage.value = data.message || 'Connexion réussie !';

    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } catch (error) {
    const errorMsg =
      error?.message ||
      (error?.response?.data?.message ?? 'Erreur de connexion');
    responseMessage.value = `❌ ${errorMsg}`;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* occupe toute la hauteur de l'écran */
  justify-content: space-between; /* espace entre le formulaire et le bouton */
  padding: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bottom-button {
  text-align: center;
}

.message {
  margin-top: 1rem;
  color: green;
}
</style>