// Copyright (c) Microsoft. All rights reserved.
import { Button, Dropdown, makeStyles, Option, SearchBox } from '@fluentui/react-components';
import { SendRegular, Dismiss20Regular } from '@fluentui/react-icons';
import React, { useId, useState } from 'react';
import { AlertType } from '../../libs/models/AlertType';
import { RootState } from '../../redux/app/store';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { addAlert } from '../../redux/features/app/appSlice';
import { Flex } from '@fluentui/react-northstar';
import { setSearch } from '../../redux/features/search/searchSlice';

const useClasses = makeStyles({
    root: {
        paddingTop: '2%',
    },
    keyWidth: {
        width: '20%',
        '& .ui-box::after': {
            transformOrigin: 'left top',
        },
    },
    inputWidth: {
        maxWidth: '70%',
        width: '70%',
        '& .ui-box::after': {
            transformOrigin: 'left top',
        },
    },
});

interface SearchInputProps {
    onSubmit: (specialization: string, value: string) => Promise<void>;
    defaultSpecializationKey?: string;
}

interface Specialization {
    key: string;
    name: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSubmit, defaultSpecializationKey = '' }) => {
    const classes = useClasses();
    const dispatch = useAppDispatch();
    const { specializations } = useAppSelector((state: RootState) => state.app);

    // Find the specialization name based on the defaultSpecializationKey
    const defaultSpecialization = specializations.find((spec) => spec.key === defaultSpecializationKey) ?? {
        key: '',
        name: '',
    };

    const [specialization, setSpecialization] = useState<Specialization>(defaultSpecialization);
    const [value, setValue] = useState('');

    const dropdownId = useId();

    const clearSearchInputState = () => {
        // setSpecialization({ key: '', name: '' });
        setValue('');
        dispatch(setSearch({ count: 0, value: [] }));
    };

    const handleSubmit = () => {
        if (value.trim() === '' || specialization.key.trim() === '') {
            return; // only submit if value is not empty
        }
        onSubmit(specialization.key, value).catch((error) => {
            const message = `Error submitting search input: ${(error as Error).message}`;
            dispatch(
                addAlert({
                    type: AlertType.Error,
                    message,
                }),
            );
        });
        //clearSearchInputState();
    };

    return (
        <>
            <div className={classes.root}>
                <Flex>
                    <Dropdown
                        className={classes.keyWidth}
                        aria-labelledby={dropdownId}
                        placeholder="Select specialization"
                        value={specialization.name}
                        selectedOptions={[specialization.name]}
                    >
                        {specializations.map(
                            (specialization) =>
                                specialization.key != 'general' && (
                                    <Option
                                        key={specialization.key}
                                        onClick={() => {
                                            setSpecialization({ key: specialization.key, name: specialization.name });
                                        }}
                                    >
                                        {specialization.name}
                                    </Option>
                                ),
                        )}
                    </Dropdown>
                    <SearchBox
                        placeholder="Search..."
                        className={classes.inputWidth}
                        value={value}
                        appearance="outline"
                        onChange={(_event, data) => {
                            setValue(data.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                handleSubmit();
                            }
                        }}
                        dismiss={
                            <Button
                                title="Reset"
                                aria-label="Reset Search"
                                appearance="transparent"
                                icon={<Dismiss20Regular />}
                                onClick={() => {
                                    clearSearchInputState();
                                }}
                            />
                        }
                    />
                    {/* <Input
                        
                        className={classes.inputWidth}
                        value={value}
                        onChange={(_event, data) => {
                            setValue(data.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                handleSubmit();
                            }
                        }}
                    /> */}
                    <Button
                        title="Submit"
                        aria-label="Search"
                        appearance="transparent"
                        icon={<SendRegular />}
                        onClick={() => {
                            handleSubmit();
                        }}
                    />
                </Flex>
            </div>
        </>
    );
};
