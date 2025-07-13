import { defineStore } from "pinia"
import { ref, computed } from "vue"

export interface IAgency {
  id: string
  name: string
  tagline: string
  logo: string
  rating: number
  reviewCount: number
  work: string
  location: string
  budget: number
  size: string
  slogan?: string
  contactEmail?: string
  phoneNumber?: string
  website?: string
}

export const useAgenciesStore = defineStore("agencies", () => {
  const allAgencies = ref<IAgency[]>([
    {
      id: "1",
      name: "Pursuit Limited",
      tagline: "Unlock your dreams",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2Fqnryp9mccvbx7ztyz14a7t8j6zmh%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.5,
      reviewCount: 120,
      work: "Advertising",
      location: "Dhaka, Bangladesh",
      budget: 1000,
      size: "1-10",
      slogan: "Unlock your dreams with creative advertising solutions.",
      contactEmail: "info@pursuit.com",
      phoneNumber: "+8801712345678",
      website: "https://pursuit.com",
    },
    {
      id: "2",
      name: "Instant Solution",
      tagline: "Effortlessly accurate, every time",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F7g216o3waox2yzgwy03xddv8zrz2%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.8,
      reviewCount: 250,
      work: "Digital Marketing",
      location: "Dhaka, Bangladesh",
      budget: 2000,
      size: "11-50",
      slogan: "Your one-stop solution for digital success.",
      contactEmail: "contact@instantsolution.com",
      phoneNumber: "+8801812345678",
      website: "https://instantsolution.com",
    },
    {
      id: "3",
      name: "Markimist",
      tagline: "Build a Brand, Not Just a Business!!",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F8wmpt91w4pfcxzgfi594ujk34mvv%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.2,
      reviewCount: 80,
      work: "Branding",
      location: "Chittagong, Bangladesh",
      budget: 500,
      size: "11-50",
      slogan: "Crafting identities that resonate.",
      contactEmail: "hello@markimist.com",
      phoneNumber: "+8801912345678",
      website: "https://markimist.com",
    },
    {
      id: "4",
      name: "Creative Spark",
      tagline: "Igniting your brand potential",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F2x3y4z5w6v7u8t9s0r1q2p3o4n5m6l7k%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.7,
      reviewCount: 180,
      work: "Advertising",
      location: "Dhaka, Bangladesh",
      budget: 1500,
      size: "51-200",
      slogan: "Where ideas come to life.",
      contactEmail: "info@creativespark.com",
      phoneNumber: "+8801612345678",
      website: "https://creativespark.com",
    },
    {
      id: "5",
      name: "Digital Edge",
      tagline: "Leading the digital revolution",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.9,
      reviewCount: 300,
      work: "SEO",
      location: "Sylhet, Bangladesh",
      budget: 2500,
      size: "51-200",
      slogan: "Mastering the art of online visibility.",
      contactEmail: "sales@digitaledge.com",
      phoneNumber: "+8801512345678",
      website: "https://digitaledge.com",
    },
    {
      id: "6",
      name: "Brand Builders",
      tagline: "Crafting unforgettable brands",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.6,
      reviewCount: 150,
      work: "Branding",
      location: "Dhaka, Bangladesh",
      budget: 1200,
      size: "11-50",
      slogan: "Your brand, our passion.",
      contactEmail: "contact@brandbuilders.com",
      phoneNumber: "+8801723456789",
      website: "https://brandbuilders.com",
    },
    {
      id: "7",
      name: "Media Mavericks",
      tagline: "Innovating media solutions",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.4,
      reviewCount: 90,
      work: "Media Buying",
      location: "Khulna, Bangladesh",
      budget: 1800,
      size: "1-10",
      slogan: "Strategic media for maximum impact.",
      contactEmail: "info@mediamavericks.com",
      phoneNumber: "+8801823456789",
      website: "https://mediamavericks.com",
    },
    {
      id: "8",
      name: "Pixel Perfect",
      tagline: "Designing the future, one pixel at a time",
      logo: "https://www.sortlist.com/_next/image?url=https%3A%2F%2Fsortlist.gumlet.io%2Fsortlist-core-api%2F9z0x1c2v3b4n5m6l7k8j9h0g1f2d3s4a%3Fw%3D150%26q%3D95%26format%3Dgif&w=128&q=75",
      rating: 4.7,
      reviewCount: 210,
      work: "Web Design",
      location: "Dhaka, Bangladesh",
      budget: 900,
      size: "11-50",
      slogan: "Stunning designs, flawless execution.",
      contactEmail: "hello@pixelperfect.com",
      phoneNumber: "+8801923456789",
      website: "https://pixelperfect.com",
    },
  ])

  const searchTerm = ref("")
  const sortBy = ref("name") // 'name', 'rating', 'budget'
  const filterByLocation = ref("")
  const filterByWork = ref("")
  const filterBySize = ref("")

  const locations = computed(() => [...new Set(allAgencies.value.map((a) => a.location))])
  const workTypes = computed(() => [...new Set(allAgencies.value.map((a) => a.work))])
  const sizes = computed(() => [...new Set(allAgencies.value.map((a) => a.size))])

  const filteredAndSortedAgencies = computed(() => {
    let result = allAgencies.value

    // Apply search
    if (searchTerm.value) {
      const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
      result = result.filter(
        (agency) =>
          agency.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          agency.tagline.toLowerCase().includes(lowerCaseSearchTerm) ||
          agency.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          agency.work.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    // Apply filters
    if (filterByLocation.value) {
      result = result.filter((agency) => agency.location === filterByLocation.value)
    }
    if (filterByWork.value) {
      result = result.filter((agency) => agency.work === filterByWork.value)
    }
    if (filterBySize.value) {
      result = result.filter((agency) => agency.size === filterBySize.value)
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy.value === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy.value === "rating") {
        return b.rating - a.rating // Descending rating
      } else if (sortBy.value === "budget") {
        return a.budget - b.budget // Ascending budget
      }
      return 0
    })

    return result
  })

  function addAgency(agency: IAgency) {
    allAgencies.value.push(agency)
  }

  function updateAgency(updatedAgency: IAgency) {
    const index = allAgencies.value.findIndex((a) => a.id === updatedAgency.id)
    if (index !== -1) {
      allAgencies.value[index] = updatedAgency
    }
  }

  function deleteAgency(id: string) {
    allAgencies.value = allAgencies.value.filter((agency) => agency.id !== id)
  }

  return {
    allAgencies,
    filteredAndSortedAgencies,
    searchTerm,
    sortBy,
    filterByLocation,
    filterByWork,
    filterBySize,
    locations,
    workTypes,
    sizes,
    addAgency,
    updateAgency,
    deleteAgency,
  }
})
