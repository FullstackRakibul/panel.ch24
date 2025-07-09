<template>
  <div class="company-goals-page">

    <!-- Header -->
    <div class="gradient-header">
      <h1 class="title">Channel 24 Goals & Vision</h1>
      <p class="subtitle">
        আমাদের লক্ষ্য হলো একটি পেশাদার, উদ্ভাবনী এবং প্রগতিশীল নিউজ পরিবেশ তৈরি করা — যেখানে প্রতিটি কর্মীই সফলতার
        অংশীদার।
      </p>
    </div>

    <!-- Cards Section -->
    <div class="card-section">
      <div class="goal-card" v-for="goal in goals" :key="goal.title" :style="{ backgroundImage: `url(${goal.image})` }">
        <div class="overlay">
          <h2 class="goal-title">{{ goal.title }}</h2>
          <div class="tags">
            <span class="tag" v-for="tag in goal.tags" :key="tag">{{ tag }}</span>
          </div>
          <el-button circle :icon="goal.buttonIcon" class="goal-btn" />
        </div>
      </div>
    </div>

    <!-- Posts Section -->
    <div class="posts-section">
      <h2 class="posts-header">📢 কর্মীদের জন্য বার্তা</h2>
      <div class="post-box" v-for="post in posts" :key="post.title">
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
      </div>
    </div>

    <!-- Company Info -->
    <div class="company-info">
      <h2>📍 ঠিকানা</h2>
      <p>
        টাইমস মিডিয়া ভবন (১০,১১ তলা), ৩৮৭ দক্ষিণ তেজগাঁও বাণিজ্যিক এলাকা, ঢাকা ১২০৮, বাংলাদেশ।
      </p>
      <h2>📰 আমাদের যাত্রা</h2>
      <p>
        চ্যানেল২৪ একটি নির্ভরযোগ্য এবং ২৪ ঘণ্টার সংবাদ মাধ্যম হিসেবে আত্মপ্রকাশ করে। সাভারের রানা প্লাজা দুর্ঘটনা থেকে
        শুরু করে খেলাধুলা, বিনোদন, অর্থনীতি — সবখানেই চ্যানেল২৪ রয়েছে সর্বপ্রথম। বিভিন্ন সময়ে বিভিন্ন বিভাগে বিশেষ
        বুলেটিন প্রচারিত হয়ে থাকে: দেশ টুয়েন্টিফোর, স্পোর্টস টুয়েন্টিফোর, কালার্স টুয়েন্টিফোর, প্রাইম নিউজ এবং আলোচিত
        টকশো মুক্তবাক, সারাবাংলা ও মুক্তকণ্ঠ।
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ArrowRight, TopRight } from '@element-plus/icons-vue'

const goals = [
  {
    title: 'Career',
    tags: ['Software Developer', 'Data Scientist', 'Product Manager', 'System Analyst', 'UX Designer'],
    image: 'https://bdgovtjob.net/wp-content/uploads/2020/06/Channel-24-Job-Circular.jpg',
    buttonIcon: ArrowRight
  },
  {
    title: 'Company',
    tags: ['Teamwork', 'Innovation', 'Transparency', 'Growth Culture', 'Trust'],
    image: 'https://backoffice.channel24bd.tv/media/imgAll/2022May/PLATE/channel24-1653375964.jpg',
    buttonIcon: ArrowRight
  },
  {
    title: 'Technology',
    tags: ['AI', 'Data', 'Broadcast Tech', 'Cloud Infra', 'Security'],
    image: 'https://www.tritechbd.com/wp-content/uploads/2018/12/Channel-24.jpg',
    buttonIcon: TopRight
  }
]

const posts = [
  {
    title: '১. কর্মীর উন্নয়ন মানেই প্রতিষ্ঠানের উন্নয়ন',
    body: 'আপনি যত দক্ষ হবেন, প্রতিষ্ঠান তত লাভবান হবে। প্রতিদিন কিছু না কিছু নতুন শেখার চেষ্টা করুন।'
  },
  {
    title: '২. দলগত কাজ আমাদের শক্তি',
    body: 'একটি দল যখন একসাথে মিশে কাজ করে, তখন যে কোন চ্যালেঞ্জই জয় করা সম্ভব। বিশ্বাস এবং পারস্পরিক শ্রদ্ধা তৈরি করুন।'
  },
  {
    title: '৩. উদ্ভাবনের চেতনা ধরে রাখুন',
    body: 'আপনার আইডিয়াগুলো শেয়ার করুন। আপনার উদ্ভাবনী চিন্তাই ভবিষ্যৎকে রূপ দেবে।'
  },
  {
    title: '৪. সময়ের মূল্য দিন',
    body: 'সঠিক সময়ে কাজ শেষ করা শুধুমাত্র আপনার কাজ নয়, এটি প্রতিষ্ঠানকেও বিশ্বস্ততা এনে দেয়। সময়ানুবর্তিতা পেশাদারিত্বের মূল চাবিকাঠি।'
  }
]
</script>

<style scoped>
.company-goals-page {
  padding: 24px;
  font-family: 'Poppins', sans-serif;
}

.gradient-header {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  padding: 32px;
  border-radius: 20px;
  color: white;
  margin-bottom: 32px;
  text-align: left;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  max-width: 720px;
  line-height: 1.6;
}

.card-section {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 48px;
}

.goal-card {
  flex: 1 1 300px;
  border-radius: 24px;
  height: 360px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.goal-card:hover {
  transform: scale(1.02);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 24px;
}

.goal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background: white;
  color: #111827;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.goal-btn {
  align-self: flex-end;
  background: white;
  color: black;
  border-radius: 50%;
}

.posts-section {
  margin-bottom: 48px;
}

.posts-header {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.post-box {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.post-box h3 {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.post-box p {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.company-info {
  background: #f3f4f6;
  padding: 24px;
  border-radius: 12px;
  color: #1f2937;
}

.company-info h2 {
  font-size: 18px;
  margin-top: 16px;
  font-weight: 600;
}
</style>