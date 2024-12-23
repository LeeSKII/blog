<template>
  <Button label="Submit" />
  <Checkbox v-model="checked" binary />
  <DatePicker v-model="date" />
  {{ date }}
  {{ checked }}
  <Dialog />
</template>
<script setup lang="ts">
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Checkbox from "primevue/checkbox";
import Dialog from "./Dialog.vue";
import { ref } from "vue";
const checked = ref(false);
const date = ref(new Date());
</script>
