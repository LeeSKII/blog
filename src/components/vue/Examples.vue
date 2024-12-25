<template>
  <div class="flex flex-col md:flex-row items-center gap-3"> <Button label="Submit" />
    <Checkbox v-model="checked" binary />
    <DatePicker v-model="date" />
    {{ date }}
    {{ checked }}
    <Dialog />
    <div class="card flex justify-center">
      <Drawer v-model:visible="visible" header="Drawer">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.</p>
      </Drawer>
      <Button icon="pi pi-arrow-right" @click="visible = true" />
    </div>
  </div>

</template>
<script setup lang="ts">
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Checkbox from "primevue/checkbox";

import Drawer from 'primevue/drawer';

import Dialog from "./Dialog.vue";
import { ref } from "vue";
const checked = ref(false);
const date = ref(new Date());
const visible = ref(false);
</script>
