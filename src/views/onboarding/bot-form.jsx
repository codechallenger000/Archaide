import { useEffect } from 'react'
import { Col, Form, Row } from 'reactstrap'
import { Check } from 'react-feather'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDataCtx } from '@context/app/appDataContext'

import FormField from '@components/form-field'
import SubmitButton from '@components/submit-button'
import BotEditForm from '../../@core/components/botedit-form'
import useBrokers from '../../utility/hooks/useBrokers'
import { broker_schema } from '../../const/broker'

// Component to render the Bot form
const BotForm = ({ onNext }) => {
  // Load brokers and bots data
  const { data: brokers } = useBrokers()
  const { bots } = useAppDataCtx()

  // Map broker data to options format for the select input
  const brokerOptions = brokers?.map(({ _id, name }) => ({
    value: _id,
    label: name,
  })) || []

  // Initialize form methods
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(broker_schema),
  })

  // Handle form submission
  const handleFormSubmit = (formData) => {
    const { brokerId, ...rest } = formData
    const updatedData = { ...rest, brokerId: brokerId.value }
    bots.create(updatedData, onNext)
  }

  useEffect(() => {
    brokers?.load()
  }, [brokers])

  return (
    <div>
      <h2 className="mt-3 mb-2">Enter Bot Details</h2>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* BotEditForm for handling the inputs */}
            <BotEditForm
              brokersOptions={brokerOptions}
              control={control}
              errors={errors}
            />
            <div className="d-flex justify-content-center mt-2">
              <SubmitButton isSubmitting={isSubmitting} disabled={isSubmitting}>
                <LaunchBotButton />
              </SubmitButton>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

// Button component for launching the bot
const LaunchBotButton = () => (
  <div className="d-flex align-items-center">
    <div
      className="d-flex align-items-center justify-content-center rounded-circle bg-white text-primary mr-1"
      style={{ width: '50px', height: '50px' }}
    >
      <Check size={32} style={{ color: '#2D8CFF' }} />
    </div>
    <div className="d-flex flex-column align-items-center">
      <span className="font-weight-bold" style={{ fontSize: '2rem' }}>
        Launch This Bot
      </span>
      <span>Bot Launches As Inactive</span>
    </div>
  </div>
)

export default BotForm
