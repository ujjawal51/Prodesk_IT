import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stepOneSchema, stepTwoSchema, fullSchema } from '../schemas/registrationSchema';
import ProgressBar from './ProgressBar';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import SuccessView from './SuccessView';
import { ArrowRight, ArrowLeft, Send } from 'lucide-react';

export default function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(fullSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const values = watch();

  const isValid = () => {
    if (step === 1) {
      return stepOneSchema.safeParse({
        firstName: values.firstName,
        lastName: values.lastName,
        dob: values.dob,
      }).success;
    }
    if (step === 2) {
      return stepTwoSchema.safeParse({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).success;
    }
    if (step === 3) {
      return fullSchema.safeParse(values).success;
    }
    return false;
  };

  const onNext = async () => {
    const fields = step === 1 ? ['firstName', 'lastName', 'dob'] : ['email', 'password', 'confirmPassword'];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const onBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data) => {
    console.log('Registration Payload:', data);
    setSubmitted(data);
    setDone(true);
  };

  const onReset = () => {
    reset();
    setStep(1);
    setDone(false);
    setSubmitted(null);
  };

  if (done && submitted) {
    return (
      <div className="wizard-card">
        <SuccessView data={submitted} onReset={onReset} />
      </div>
    );
  }

  return (
    <div className="wizard-card">
      <ProgressBar step={step} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === 1 && <StepOne register={register} errors={errors} />}
        {step === 2 && <StepTwo register={register} errors={errors} watch={watch} />}
        {step === 3 && <StepThree data={getValues()} onEdit={setStep} />}

        <div className="wizard-actions">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={onBack}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={onNext}
              disabled={!isValid()}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={!isValid()}>
              Submit <Send size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
