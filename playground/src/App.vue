<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <ul>
      <li><RouterLink to="/button">Button</RouterLink></li>
      <li><RouterLink to="/descriptions">Descriptions</RouterLink></li>
      <li><RouterLink to="/markdown-preview">Markdown Preview</RouterLink></li>
      <li><RouterLink to="/dialog">Dialog</RouterLink></li>
      <li><RouterLink to="/loading">Loading</RouterLink></li>
      <li><RouterLink to="/drawer">Drawer</RouterLink></li>
    </ul>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
