import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ValidateInput } from '../components/InputValidation';
import { TitleArea } from '../components/Reusables';
import { AuthClient } from '../generated';

export function Login() {

	type PrefilledFileds = { username?: string; password?: string; } | undefined;
	const location = useLocation<PrefilledFileds>();
	const history = useHistory();

	interface LoginFields {
		username: string;
		password: string;
	}

	const onSubmit = async (values: LoginFields, actions: FormikHelpers<LoginFields>) => {
		actions.setSubmitting(true);
		const auth = new AuthClient();
		const jwt = await auth.login(values.username, values.password);

		if (jwt === null) {
			//bad combination
			alert('wrong username or password combination');
		}
		else {
			console.log('you\'re logged in!');
			localStorage.setItem('jwt', jwt);

			history.push('/quote');
		}
		actions.setSubmitting(false);
	}

	const handleRegClick = (values: LoginFields) => {
		// redirects to another component while providing the other component some state
		history.push('/register', { username: values.username, password: values.password });
	}

	// HTML for Login page (first page user should see)
	return (
		<div id="login" className="body-wrapper userform">
			<div className="flex-container login-flex">
				<div id="login-area">
					<div className="sticky-wrapper">
						<TitleArea />

						<Formik<LoginFields>
							initialValues={{
								username: location.state ? (location.state.username || '') : '',
								password: location.state ? (location.state.password || '') : '',
							}}
							validationSchema={Yup.object({
								username: Yup.string()
									// see: https://stackoverflow.com/a/37658211
									.matches(/^[a-zA-Z0-9]+(?:[_-]?[a-zA-Z0-9])*$/, 'A username can only be alphanumeric with _ -')
									.required('Required'),
								password: Yup.string()
									.required('Required'),
							})}
							enableReinitialize
							onSubmit={onSubmit}>
							
							{({ isSubmitting, isValid, errors, touched, values }: { isSubmitting: any, isValid: any, errors: any, touched: any, values: any }) => (
								// or this can be left as: { isSubmitting, isValid, errors, touched, values } only, but to avoid errors, we explicitly init as 'any'
								<Form id="login-form" className="userform">
									<div id="login-wrapper">
										<div className="field-row">
											<div id="uname" className="field floating-label">
												<Field component={ValidateInput} name="username" className="floating-label" type="text" disabled={isSubmitting} />
												<label className="floating-label" htmlFor="username">Username</label>
												{errors.username && touched.username ? <span className="errors">{errors.username}</span> : <></>}
											</div>
										</div>

										<div className="field-row">
											<div id="pword" className="field floating-label">
												<Field component={ValidateInput} name="password" className="floating-label" type="password" disabled={isSubmitting} />
												<label className="floating-label" htmlFor="password">Password</label>
												{errors.password && touched.password ? <span className="errors">{errors.password}</span> : <></>}
											</div>
										</div>

										<div className="button-grid">
											<button className="form-button" type="submit" disabled={isSubmitting || !isValid}>Login</button>
											<button className="form-button" onClick={() => handleRegClick(values)}>Register</button>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
			<div className="flex-container main-flex"></div>
		</div>
	);
}
