<template>
  <div class="register-container">
    <form @submit.prevent="handleRegister" class="register-form">
      <input v-model="firstName" placeholder="Prénom" required />
      <input v-model="lastName" placeholder="Nom" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button>S'inscrire</button>

      <!-- Affiche le message de réponse -->
      <p v-if="responseMessage" :class="{ error: isError, success: !isError }">
        {{ responseMessage }}
      </p>
    </form>

    <!-- Bouton retour vers la page de login -->
    <div class="bottom-button">
      <button @click="goToLogin">Déjà un compte ? Se connecter</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const responseMessage = ref('');
const isError = ref(false);

const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      isError.value = true;
      responseMessage.value = data.message || 'Erreur lors de l’inscription';
      return;
    }

    isError.value = false;
    responseMessage.value = 'Inscription réussie ! Redirection en cours...';

    // Redirection vers le login après 2s
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (err) {
    isError.value = true;
    responseMessage.value = 'Une erreur est survenue.';
  }
};

const goToLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bottom-button {
  text-align: center;
  margin-top: auto;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
