import React, { FormEvent, useState } from "react";
import { CountryCodes } from "validate-vat-ts";
import styled from "styled-components";
import { Form, DropdownProps, Button } from "semantic-ui-react";
import saveBillingInfo from "../api/saveBillingInfo";

const FormHeader = styled.h2`
    font-size: 24px;
    font-weight: bold;
    color: #000;
`;

const FormLayout = styled.div`
    margin: 16px;
    min-height: 300px;
`;

export type Errors = { [key: string]: string };

export interface Countries {
    country: string;
    states: string[];
}

export interface IFormValues {
    name: string;
    company: string;
    vat: string;
    zip_code: string;
    city: string;
    address: string;
    state: string;
    country: string;
}

export interface IBillingInfoModalForm extends IFormValues {
    closeModal: () => void;
    countries: Countries[];
}

const CountryCodesObject = Object.entries(CountryCodes).reduce(
    (codes, [key, value]) => {
        codes[key] = value;
        return codes;
    },
    {} as { [key: string]: string }
);

const BillingInfoModalForm = ({
    closeModal,
    countries = [],
    ...props
}: IBillingInfoModalForm) => {
    const [state, setState] = useState(props);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newData: Partial<typeof props> = { [e.target.id]: e.target.value };
        let newErrors: Errors = { [e.target.id]: "" };
        setState({ ...state, ...newData });
        setErrors({ ...errors, ...newErrors });
    };
    const hasVat = CountryCodesObject[state.country.replace(/\s/g, "")];
    const onSelect = (
        e: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        let newData: Partial<typeof props> = { [data.name]: data.value };
        let newErrors: Errors = { [data.name]: "" };
        if (data.name === "country" && state.country !== data.value) {
            newData.state = "";
            newData.vat = "";
            newErrors.state = "";
            newErrors.vat = "";
        }
        setState({ ...state, ...newData });
        setErrors({ ...errors, ...newErrors });
    };
    const submit = async (e: FormEvent) => {
        try {
            setLoading(true);
            const errors = await validate();
            if (Object.keys(errors).length === 0) {
                const success = await saveBillingInfo(state);
                if (success) {
                    closeModal();
                }
            }
        } finally {
            setLoading(false);
        }
    };
    const validate = async () => {
        const errors: Errors = {};
        const nameRegex = /^[\wА-Яа-яЁё]{2,} [\wА-Яа-яЁё]{2,}/;
        if (!nameRegex.exec(state.name)) {
            errors.name = "Please enter your full name";
        }
        if (!!hasVat && state.vat) {
            try {
                const response = await fetch("http://localhost:3333/vat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code: hasVat,
                        vat: state.vat,
                    }),
                });
                const { valid } = await response.json();
                if (!valid) {
                    errors.vat = "VAT number is invalid";
                }
            } catch {
                errors.vat = "Server error. Check vat again or try later.";
            }
        }

        if (!!hasVat && !state.vat) {
            errors.vat = "Please enter VAT ID";
        }

        if (state.company.length < 3) {
            errors.company = "Company should be at least 3 characters length";
        }
        if (state.zip_code.length < 3) {
            errors.zip_code = "Zip code should be at least 3 characters length";
        }
        if (state.address.length < 7) {
            errors.address = "Address should be at least 7 characters length";
        }

        if (
            !!countries.find(({ country }) => country == state.country)?.states
                .length &&
            !state.state
        ) {
            errors.state = "Please select state from list";
        }

        if (!state.city) {
            errors.city = "Please enter city";
        }

        setErrors(errors);
        return errors;
    };
    return (
        <Form loading={loading} onSubmit={submit}>
            <FormLayout>
                <FormHeader>Billing Details</FormHeader>
                <Form.Input
                    onChange={onChange}
                    value={state.name}
                    id="name"
                    label="Customer Full Name"
                    placeholder="e.g. John Smith"
                    error={errors.name || undefined}
                ></Form.Input>
                <Form.Input
                    onChange={onChange}
                    value={state.company}
                    error={errors.company || undefined}
                    placeholder="e.g. Coca Cola"
                    id="company"
                    label="Company Name"
                ></Form.Input>
                <Form.Group widths="equal">
                    <Form.Select
                        name="country"
                        id="country"
                        value={state.country}
                        label="Country"
                        error={errors.country || undefined}
                        placeholder="e.g. Finland"
                        options={countries.map(({ country }) => ({
                            text: country,
                            value: country,
                        }))}
                        onChange={onSelect}
                    ></Form.Select>
                    <Form.Input
                        disabled={!hasVat}
                        name="vat"
                        id="vat"
                        value={state.vat}
                        onChange={onChange}
                        error={errors.vat || undefined}
                        label="VAT ID"
                    ></Form.Input>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        name="city"
                        id="city"
                        value={state.city}
                        onChange={onChange}
                        error={errors.city || undefined}
                        placeholder="e.g. Helsinki"
                        label="City"
                    ></Form.Input>
                    <Form.Select
                        name="state"
                        id="state"
                        value={state.state}
                        options={
                            countries
                                .find(({ country }) => country == state.country)
                                ?.states.map((state) => ({
                                    text: state,
                                    value: state,
                                })) || []
                        }
                        label="State"
                        error={errors.state || undefined}
                        onChange={onSelect}
                    ></Form.Select>
                </Form.Group>
                <Form.Input
                    name="zip_code"
                    id="zip_code"
                    value={state.zip_code}
                    onChange={onChange}
                    error={errors.zip_code || undefined}
                    placeholder="e.g. 551321"
                    label="ZIP Code"
                ></Form.Input>
                <Form.TextArea
                    value={state.address}
                    id="address"
                    name="address"
                    error={errors.address || undefined}
                    label="Address"
                    placeholder="e.g. 2450 Iroquois Ave."
                    onChange={(e, data) => {
                        setState({ ...state, [data.name]: data.value });
                        setErrors({ ...errors, [data.name]: "" });
                    }}
                ></Form.TextArea>
                <Button color="green" type="submit">
                    Go to Checkout
                </Button>
            </FormLayout>
        </Form>
    );
};

export default BillingInfoModalForm;
