<script setup lang="ts">
</script>

<template>
  <div class="home-hero">
    <div class="hero-content">
      <h1 class="title">
        <span class="gradient">Grain</span>
      </h1>
      <p class="subtitle">Universal interaction layer for AI interfaces</p>
      <p class="description">Standard vocabulary for every surface where AI meets humans — or AI meets AI.</p>
      
      <div class="cta-group">
        <span class="command">npx create-grain-app my-ai-app</span>
        <a href="/guide/getting-started" class="primary-btn">Get Started</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 60px;
  background: radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
}

.hero-content {
  max-width: 800px;
}

.title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
}

.gradient {
  background: linear-gradient(to bottom, #fff 40%, rgba(255, 255, 255, 0.5));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.25rem;
  color: #a1a1a6;
  margin-bottom: 16px;
  font-weight: 400;
}

.description {
  font-size: 1rem;
  color: #86868b;
  margin-bottom: 48px;
  font-weight: 400;
}

.cta-group {
  display: flex;
  align-items: center;
  background: #111;
  padding: 6px 6px 6px 24px;
  border-radius: 100px;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: fit-content;
  margin: 0 auto;
}

.command {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #a1a1a6;
}

.primary-btn {
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 28px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .cta-group {
    flex-direction: column;
    padding: 16px;
    border-radius: 16px;
    gap: 12px;
    width: 100%;
    max-width: 320px;
  }
  
  .primary-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
