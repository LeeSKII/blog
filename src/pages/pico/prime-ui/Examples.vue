<template>
  <Button label="Submit" />
  <Checkbox v-model="checked" binary />
  <DatePicker v-model="date" />
  {{ date }}
  {{ checked }}
  <Drawer />
</template>
<script setup lang="ts">
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Checkbox from "primevue/checkbox";
import Drawer from "./Drawer.vue";
import { ref } from "vue";
const checked = ref(false);
const date = ref(new Date());
</script>
