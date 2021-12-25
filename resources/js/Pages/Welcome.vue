<template>
  <Head title="Welcome" />
  <div class="fixed z-10 py-40 top-10 left-10">
    <Link href="/">
      <BreezeApplicationLogo class="w-20 h-20 text-gray-500 fill-current" />
    </Link>
  </div>
  <div
    class="relative flex justify-center min-h-screen bg-gray-100  items-top sm:items-center sm:pt-0"
  >
    <div v-if="canLogin" class="fixed top-0 right-0 hidden px-6 py-4 sm:block">
      <Link
        v-if="$page.props.auth.user"
        :href="route('dashboard')"
        class="text-sm text-gray-700 underline"
      >
        Dashboard
      </Link>

      <template v-else>
        <Link :href="route('login')" class="text-sm text-gray-700 underline">
          Log in
        </Link>

        <Link
          v-if="canRegister"
          :href="route('register')"
          class="ml-4 text-sm text-gray-700 underline"
        >
          Register
        </Link>
      </template>
    </div>

    <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
      <div class="flex justify-center mt-4 sm:items-center sm:justify-between">
        <div class="">
          <h2 class="mb-10 text-4xl text-indigo-500">COVID-19 Problem</h2>
          <span class="block"
            >Stay at Home quarantine To stop Corona virus</span
          >
          <p class="block mb-10">
            If you would like to start monitoring COVID Cases, Please sign in.
          </p>
          <br />
          <a
            href="/login"
            class="p-6 mt-10 ml-2 text-xl text-white bg-green-700 rounded-lg shadow-lg  semi-bold"
            >Let get started</a
          >
        </div>

        <div class="relative">
          <img
            src="/svg/section-image.svg"
            class="section__image"
            alt="Quarantine"
          />
          <img src="/svg/section-virus.svg" class="section__virus1" alt="" />
          <img src="/svg/section-virus.svg" class="section__virus2" alt="" />
          <img src="/svg/section-virus.svg" class="section__virus3" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.section__image {
  width: 100%;
  z-index: 3;
}
.section__virus1 {
  position: absolute;
  bottom: 40px;
  left: 0px;
  width: 150px;
  z-index: 1;
  animation: spin 10s linear infinite;
}
.section__virus2 {
  position: absolute;
  top: 0;
  right: 0px;
  width: 100px;
  opacity: 0.8;
  z-index: 1;
  animation: spin 20s linear infinite;
}
.section__virus3 {
  position: absolute;
  top: 200px;
  right: 40px;
  width: 100px;
  z-index: 1;
  animation: spin 20s linear infinite;
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.section .covidImage__image {
  width: 330px;
}
</style>

<script>
import { Head, Link } from "@inertiajs/inertia-vue3";
import BreezeApplicationLogo from "@/Components/ApplicationLogo.vue";
export default {
  components: {
    Head,
    BreezeApplicationLogo,
    Link,
  },
  props: {
    canLogin: Boolean,
    canRegister: Boolean,
    laravelVersion: String,
    phpVersion: String,
  },
};
</script>
