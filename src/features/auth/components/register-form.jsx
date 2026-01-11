import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm({
  className,
  onSubmit,
  error,
  isSubmitting,
  onSwitch,
  ...props
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.name) {
      errors.name = 'Tên không được để trống'
    }

    if (!formData.email) {
      errors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (!formData.phone) {
      errors.phone = 'Số điện thoại không được để trống'
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng nhập lại mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu nhập lại không khớp'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm() && onSubmit) {
      const { confirmPassword, ...data } = formData
      onSubmit(data)
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))

    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create account</h1>
                <p className="text-muted-foreground">
                  Register a new account
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="098xxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.password ? 'border-red-500' : ''}
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.confirmPassword ? 'border-red-500' : ''}
                />
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </Field>

              <Field>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang đăng ký...' : 'Register'}
                </Button>
              </Field>

              <FieldSeparator />

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitch}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Login
                </button>
              </FieldDescription>
            </FieldGroup>
          </div>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
