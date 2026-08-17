import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export default function Stepper({ steps = [], currentStep = 1, onStepClick }) {
  const totalSteps = steps.length;

  const progress =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const handleStepClick = (stepNumber) => {
    if (!onStepClick) return;

    /*
     * Permite volver a pasos anteriores.
     * Evita saltar directamente a pasos futuros.
     */
    if (stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full space-y-7">
      {/* Información y porcentaje */}
      <div className="flex flex-col gap-5 rounded-xl bg-emerald-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <InformationCircleIcon className="mt-0.5 h-7 w-7 shrink-0 text-emerald-800" />

          <div>
            <p className="text-sm font-bold text-emerald-950 sm:text-base">
              Completa tu información antes de postularte.
            </p>

            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Esta información se reutilizará en todas tus postulaciones.
            </p>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="w-full shrink-0 rounded-xl bg-white px-4 py-3 shadow-sm sm:w-52">
          <p className="text-center text-xs font-bold text-emerald-950">
            Perfil {progress}% completo
          </p>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-800 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-170 items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const completed = currentStep > stepNumber;
            const active = currentStep === stepNumber;
            const enabled = stepNumber <= currentStep;

            return (
              <div
                key={step.id ?? stepNumber}
                className={`flex items-center ${
                  index === steps.length - 1 ? 'shrink-0' : 'flex-1'
                }`}
              >
                {/* Número, check y nombre */}
                <button
                  type="button"
                  disabled={!onStepClick || !enabled}
                  onClick={() => handleStepClick(stepNumber)}
                  className={`
                    group flex shrink-0 items-center gap-3
                    rounded-lg transition
                    focus:outline-none focus-visible:ring-4
                    focus-visible:ring-emerald-700/20

                    ${
                      onStepClick && enabled
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-10 w-10 shrink-0 items-center justify-center
                      rounded-full border text-sm font-bold
                      transition-all duration-300 m-2

                      ${
                        completed
                          ? 'border-emerald-800 bg-emerald-800 text-white'
                          : active
                            ? 'border-emerald-800 bg-emerald-800 text-white shadow-sm ring-4 ring-emerald-100'
                            : 'border-slate-300 bg-white text-slate-600'
                      }
                    `}
                  >
                    {completed ? <CheckIcon className="h-5 w-5" /> : stepNumber}
                  </span>

                  <span
                    className={`
                      whitespace-nowrap text-sm transition-colors

                      ${
                        active
                          ? 'font-bold text-emerald-900'
                          : completed
                            ? 'font-medium text-slate-600'
                            : 'font-medium text-slate-500'
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Línea */}
                {index < steps.length - 1 && (
                  <div className="mx-5 h-px min-w-12 flex-1 bg-slate-300">
                    <div
                      className={`
                        h-full bg-emerald-800 transition-all duration-500
                        ${completed ? 'w-full' : 'w-0'}
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
