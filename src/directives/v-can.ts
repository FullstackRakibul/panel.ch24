import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * v-can Directive
 * 
 * Conditionally removes elements from the DOM based on user permissions.
 * This is a frontend convenience only - the backend MUST always validate permissions.
 * 
 * Usage:
 *   <el-button v-can="'contracts.edit'">Edit</el-button>
 *   <div v-can="'billing.approve'">Approve Section</div>
 * 
 * The element is removed from DOM if the user lacks the specified permission.
 */
export const vCan: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const auth = useAuthStore()
    
    if (!binding.value) {
      console.warn('v-can directive requires a permission code as value')
      return
    }

    // Check if user has the required permission
    if (!auth.hasPermission(binding.value)) {
      // Remove element from DOM to prevent accidental clicks
      el.parentNode?.removeChild(el)
    }
  },
  
  // Handle updates when permission value changes dynamically
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    const auth = useAuthStore()
    
    if (!auth.hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * v-can-any Directive
 * 
 * Shows element if user has ANY of the specified permissions.
 * 
 * Usage:
 *   <el-button v-can-any="['contracts.edit', 'contracts.delete']">Manage</el-button>
 */
export const vCanAny: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
    const auth = useAuthStore()
    
    if (!Array.isArray(binding.value) || binding.value.length === 0) {
      console.warn('v-can-any directive requires an array of permission codes')
      return
    }

    if (!auth.hasAnyPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * v-can-all Directive
 * 
 * Shows element only if user has ALL of the specified permissions.
 * 
 * Usage:
 *   <div v-can-all="['billing.approve', 'billing.export']">Admin Section</div>
 */
export const vCanAll: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
    const auth = useAuthStore()
    
    if (!Array.isArray(binding.value) || binding.value.length === 0) {
      console.warn('v-can-all directive requires an array of permission codes')
      return
    }

    if (!auth.hasAllPermissions(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}
