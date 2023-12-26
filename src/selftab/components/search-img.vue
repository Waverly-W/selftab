<template>
  <div class="image-search-container">
    <input
      type="text"
      v-model="searchTerm"
      @keyup.enter="searchImages"
      placeholder="Search Unsplash images..."
      class="search-input"
    />
    <button @click="searchImages" class="search-button">Search</button>

    <div v-if="photos.length > 0" class="results-container">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="image-result"
        @click="setBackground(photo.urls.regular)"
      >
        <img :src="photo.urls.small" :alt="photo.alt_description" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const searchTerm = ref('');
const store = useStore();
const photos = ref([]);

const searchImages = async () => {
  await store.dispatch('searchPhotosModule/fetchPhotos', { query: searchTerm.value });
  photos.value = store.state.searchPhotosModule.photos;
};

const setBackground = (imageUrl) => {
  document.body.style.backgroundImage = `url(${imageUrl})`;
};
</script>

<style>
.image-search-container {
  /* Add your styling here */
}

.search-input {
  /* Add your styling here */
}

.search-button {
  /* Add your styling here */
}

.results-container {
  /* Add your styling here */
}

.image-result {
  /* Add your styling here */
}

.image-result img {
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  object-fit: cover;
}
</style>
