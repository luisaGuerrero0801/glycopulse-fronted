// /composables/usePagination.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]> | T[], itemsPerPageInit = 5) {
  const currentPage = ref(1)
  const itemsPerPage = ref(itemsPerPageInit)

  const paginatedItems = computed(() => {
    const itemsArray = Array.isArray(items) ? items : items.value
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return itemsArray.slice(start, end)
  })

  const totalPages = computed(() => {
    const itemsArray = Array.isArray(items) ? items : items.value
    return Math.ceil(itemsArray.length / itemsPerPage.value)
  })

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  return {
    currentPage,
    itemsPerPage,
    paginatedItems,
    totalPages,
    goToPage
  }
}