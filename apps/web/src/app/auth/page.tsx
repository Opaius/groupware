"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 

// ✅ Schema de validare Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Introduceți un email valid." }),
  password: z.string().min(6, { message: "Parola trebuie să aibă cel puțin 6 caractere." }),
})

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Inițializare formular
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // ✅ Handler pentru submit
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    console.log("🔐 Login attempt:", values)

    // Simulare request
    await new Promise((res) => setTimeout(res, 1500))
    setIsLoading(false)

    alert(`Bine ai venit, ${values.email}!`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Autentificare</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="exemplu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormDescription>Folosiți adresa dvs. de email pentru autentificare.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parolă</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormDescription>Introduceți parola contului dvs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Se conectează..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}