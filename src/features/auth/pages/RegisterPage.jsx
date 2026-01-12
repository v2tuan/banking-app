import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { RegisterForm } from '../components/register-form'

const RegisterPage = () => {
  const navigate = useNavigate()
  const register = useAuthStore(state => state.register)

  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await register(data)

      if (result.success) {
        // đăng ký xong quay về login
        navigate('/auth/login')
      } else {
        setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (e) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
      onSwitch={() => navigate('/auth/login')}
    />
  )
}

export default RegisterPage
