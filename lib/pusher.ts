import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  }
)

// Event types
export const PUSHER_EVENTS = {
  ORDER_STATUS: 'order:status',
  TAB_ITEM_ADDED: 'tab:item-added',
  TAB_UPDATED: 'tab:updated',
  TAB_PAID: 'tab:paid',
} as const

// Channel naming
export function getTabChannel(tabId: string): string {
  return `tab-${tabId}`
}

export function getVenueChannel(venueId: string): string {
  return `venue-${venueId}`
}

