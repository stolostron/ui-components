import React, { useState, useEffect, useContext } from 'react'
import { Wizard, WizardFooter, WizardContextConsumer, WizardProps, WizardStep } from '@patternfly/react-core'
import { AcmForm, AcmSubmit, FormContext } from '../AcmForm/AcmForm'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmAlertGroup, AcmAlertContext } from '../AcmAlert/AcmAlert'

export type AcmWizardProps = WizardProps & {
    submitLabel: string
    submitProcessingLabel?: string
}

export function AcmWizard(props: AcmWizardProps) {
    return (
        <AcmForm>
            <AcmWizardContent {...props} />
        </AcmForm>
    )
}

function AcmWizardContent(props: AcmWizardProps) {
    const formContext = useContext(FormContext)
    const alertContext = useContext(AcmAlertContext)
    const [activeStep, setActiveStep] = useState<WizardStep>(
        props.startAtStep ? props.steps[props.startAtStep - 1] : props.steps[0]
    )

    return (
        <Wizard
            {...props}
            footer={
                <>
                    <div
                        style={{
                            padding:
                                '0 var(--pf-c-wizard__main-body--PaddingRight) 0 var(--pf-c-wizard__main-body--PaddingLeft)',
                        }}
                    >
                        <AcmAlertGroup isInline canClose />
                    </div>

                    <WizardFooter>
                        <WizardContextConsumer>
                            {(context) => {
                                const lastStep = props.steps[props.steps.length - 1]
                                activeStep.name !== context.activeStep.name && setActiveStep(context.activeStep)
                                return (
                                    <>
                                        {context.activeStep.name === lastStep.name ? (
                                            <AcmSubmit
                                                label={props.submitLabel}
                                                processingLabel={props.submitProcessingLabel}
                                                onClick={props.onSave}
                                            />
                                        ) : (
                                            <AcmButton
                                                variant="primary"
                                                onClick={() => {
                                                    alertContext.clearAlerts()
                                                    formContext.setValidate(true)
                                                    if (!formContext.errors) {
                                                        context.onNext()
                                                    } else {
                                                        alertContext.addAlert({
                                                            type: 'danger',
                                                            title: 'Validation errors detected',
                                                            group: 'validation',
                                                            id: 'validation',
                                                        })
                                                    }
                                                }}
                                            >
                                                {props.nextButtonText}
                                            </AcmButton>
                                        )}
                                        <AcmButton
                                            variant="secondary"
                                            onClick={context.onBack}
                                            isDisabled={activeStep.name === props.steps[0].name}
                                        >
                                            {props.backButtonText}
                                        </AcmButton>
                                        <AcmButton variant="link" onClick={context.onClose}>
                                            {props.cancelButtonText}
                                        </AcmButton>
                                    </>
                                )
                            }}
                        </WizardContextConsumer>
                    </WizardFooter>
                </>
            }
        />
    )
}
