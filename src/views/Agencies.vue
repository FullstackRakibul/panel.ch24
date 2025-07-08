<template>
  <div class="agencies-container">
    <div class="page-header">
      <h1 class="page-title">All Advertising Companies in Bangladesh</h1>
    </div>

    <div class="agencies-grid">
      <el-card v-for="agency in agencies" :key="agency.name" class="agency-card" shadow="hover">
        <div class="agency-header">
          <img :src="agency.logo" alt="logo" class="agency-logo" />
          <h3 class="agency-name">{{ agency.name }}</h3>
          <p class="agency-tagline">{{ agency.tagline }}</p>
        </div>

        <el-divider />

        <ul class="agency-meta">
          <li>
            <el-icon>
              <Document />
            </el-icon>
            {{ agency.work }}
          </li>
          <li>
            <el-icon>
              <Location />
            </el-icon>
            {{ agency.location }}
          </li>
          <li>
            <el-icon>
              <Money />
            </el-icon>
            From {{ agency.budget }} for Advertising
          </li>
          <li>
            <el-icon>
              <User />
            </el-icon>
            {{ agency.size }} members
          </li>
        </ul>

        <div class="card-footer">
          <el-button type="primary" plain>See profile</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Document,
  Location,
  Money,
  User,
} from '@element-plus/icons-vue'

const agencies = ref([
  {
    name: 'Pursuit Limited',
    tagline: 'unlock your dreams',
    logo: 'https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2Fqnryp9mccvbx7ztyz14a7t8j6zmh%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75',
    work: '1 work in Advertising',
    location: 'Dhaka, Bangladesh',
    budget: '৳ 1,000',
    size: '1-10',
  },
  {
    name: 'Instant Solution',
    tagline: 'Effortlessly accurate, every time',
    logo: 'https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F7g216o3waox2yzgwy03xddv8zrz2%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75',
    work: '1 work in Advertising',
    location: 'Dhaka, Bangladesh',
    budget: '৳ 2,000',
    size: '11-50',
  },
  {
    name: 'Markimist',
    tagline: 'Build a Brand, Not Just a Business!!',
    logo: 'https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F8wmpt91w4pfcxzgfi594ujk34mvv%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75',
    work: 'Looking for work in Advertising',
    location: 'Dhaka, Bangladesh',
    budget: '৳ 50',
    size: '11-50',
  },
  // Add more dummy entries like above...
])
</script>

<style scoped>
.agencies-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.agencies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.agency-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 360px;
  border-radius: 10px;
}

.agency-header {
  text-align: center;
  padding: 16px 8px;
}

.agency-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 12px;
}

.agency-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.agency-tagline {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.agency-meta {
  list-style: none;
  padding: 0 16px;
  margin: 0;
  color: #374151;
}

.agency-meta li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.card-footer {
  padding: 0 16px 16px;
  text-align: center;
}
</style>