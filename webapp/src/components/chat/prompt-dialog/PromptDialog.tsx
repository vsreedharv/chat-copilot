// Copyright (c) Microsoft. All rights reserved.

import {
    Body1Strong,
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Label,
    Link,
    Tooltip,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import { Info16Regular } from '@fluentui/react-icons';
import React from 'react';
import { BotResponsePrompt, DependencyDetails, PromptSectionsNameMap } from '../../../libs/models/BotResponsePrompt';
import { IChatMessage } from '../../../libs/models/ChatMessage';
import { PlanType } from '../../../libs/models/Plan';
import { StepwiseThoughtProcess } from '../../../libs/models/StepwiseThoughtProcess';
import { useDialogClasses } from '../../../styles';
import { TokenUsageGraph } from '../../token-usage/TokenUsageGraph';
import { formatParagraphTextContent } from '../../utils/TextUtils';
import { StepwiseThoughtProcessView } from './stepwise-planner/StepwiseThoughtProcessView';

const useClasses = makeStyles({
    prompt: {
        marginTop: tokens.spacingHorizontalS,
    },
    infoButton: {
        ...shorthands.padding(0),
        ...shorthands.margin(0),
        minWidth: 'auto',
        marginLeft: 'auto', // align to right
    },
});

interface IPromptDialogProps {
    message: IChatMessage;
}

export const PromptDialog: React.FC<IPromptDialogProps> = ({ message }) => {
    const classes = useClasses();
    const dialogClasses = useDialogClasses();

    let prompt: string | BotResponsePrompt;
    try {
        prompt = JSON.parse(message.prompt ?? '{}') as BotResponsePrompt;
    } catch (e) {
        prompt = message.prompt ?? '';
    }
    let promptDetails;
    if (typeof prompt === 'string') {
        promptDetails = prompt.split('\n').map((paragraph, idx) => <p key={`prompt-details-${idx}`}>{paragraph}</p>);
    } else {
        promptDetails = Object.entries(prompt).map(([key, value]) => {
            let isStepwiseThoughtProcess = false;
            if (key === 'externalInformation') {
                const information = value as DependencyDetails;
                if (information.context) {
                    // TODO: [Issue #150, sk#2106] Accommodate different planner contexts once core team finishes work to return prompt and token usage.
                    const details = information.context as StepwiseThoughtProcess;
                    isStepwiseThoughtProcess = details.plannerType === PlanType.Stepwise;
                }

                if (!isStepwiseThoughtProcess) {
                    value = information.result;
                }
            }

            return value ? (
                <div className={classes.prompt} key={`prompt-details-${key}`}>
                    <Body1Strong>{PromptSectionsNameMap[key]}</Body1Strong>
                    {isStepwiseThoughtProcess ? (
                        <StepwiseThoughtProcessView thoughtProcess={value as DependencyDetails} />
                    ) : (
                        formatParagraphTextContent(value as string)
                    )}
                </div>
            ) : null;
        });
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Tooltip content={'Show prompt'} relationship="label">
                    <Button className={classes.infoButton} icon={<Info16Regular />} appearance="transparent" />
                </Tooltip>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Prompt</DialogTitle>
                    <DialogContent>
                        <TokenUsageGraph promptView tokenUsage={message.tokenUsage ?? {}} />
                        {promptDetails}
                    </DialogContent>
                    <DialogActions position="start" className={dialogClasses.footer}>
                        <Label size="small" color="brand">
                            Want to learn more about prompts? Click{' '}
                            <Link href="https://aka.ms/sk-about-prompts" target="_blank" rel="noreferrer">
                                here
                            </Link>
                            .
                        </Label>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
