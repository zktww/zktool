<script setup lang="ts">
const props = defineProps<{ locale: "zh-CN" | "en"; path: string }>();

const target = props.locale === "en"
    ? props.path.replace(/^\/en(?=\/|$)/, "") || "/"
    : props.path === "/" ? "/en/" : `/en${props.path}`;
</script>

<template>
  <a class="language-switch" :href="target" :lang="locale === 'en' ? 'zh-CN' : 'en'">
    {{ locale === "en" ? "中文" : "EN" }}
  </a>
</template>

<style scoped>
.language-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.25rem;
  padding: 0 0.7rem;
  border: 1px solid var(--border, #d7dee9);
  border-radius: 6px;
  color: inherit;
  background: var(--surface, #fff);
  font: 600 0.8rem/1 system-ui, sans-serif;
  text-decoration: none;
}
.language-switch:hover { border-color: #7c3aed; color: #6d28d9; }
</style>
