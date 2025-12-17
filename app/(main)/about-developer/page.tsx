import { redirect } from 'next/navigation'

export default function AboutDeveloperPage() {
  // Redirect to about page since they're the same
  redirect('/about')
}
