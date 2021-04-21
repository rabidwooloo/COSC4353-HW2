import React, { useEffect } from 'react';
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Navigation, TitleArea, toPascal, states } from '../components/Reusables';
import { ValidationBox } from '../components/InputValidation';
import { UserClient, UpdateDetails, User } from '../generated';
import DropDown from '../components/DropDown';
import '../styles/Auth.css';

// A child component is necessary to use the "useFormikContext" hook
// With that hook, we can populate the form with server data
function DataFetcher() {

	const ctx = useFormikContext();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userClient = new UserClient();
				const myself = await userClient.getMyself();

				ctx.setFieldValue('username', myself.userName!, true);
				ctx.setFieldValue('first_name', myself.firstName!, true);
				ctx.setFieldValue('last_name', myself.lastName!, true);
				ctx.setFieldValue('address1', myself.address1!, true);
				ctx.setFieldValue('address2', myself.address2!, true);
				ctx.setFieldValue('city', myself.city!, true);
				ctx.setFieldValue('state', myself.state!, true);
				ctx.setFieldValue('zip', myself.zipCode!, true);
				
			}
			catch(err) {
				console.warn('there was an issue prefilling the form fields')
				console.error(err);
			}
		}
		fetchData();
	}, []);

	return null;
}

// HTML for user profile
export function UserProfile() {

	interface ProfileFields {
		username: string;
		first_name: string;
		last_name: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		current_password: string;
		new_password: string;
	}

	const styles = {
		fontFamily: "sans-serif",
		textAlign: "center"
	};

	/*update user info*/
	const onSubmit = async (values: ProfileFields, actions: FormikHelpers<ProfileFields>) => {
		actions.setSubmitting(true);

		const updateClient = new UserClient();
		const update = await updateClient.updateUser(new UpdateDetails({
			user: new User({
				id: 0,
				userName: undefined,
				firstName: values.first_name,
				lastName: toPascal(values.last_name),
				address1: toPascal(values.address1),
				address2: toPascal(values.address2),
				city: toPascal(values.city),
				state: (values.state).toUpperCase(),
				zipCode: values.zip,
				passwordHash: undefined,
				passwordSalt: undefined,
				roles: undefined,
			}),
			currentPassword: values.current_password,
			newPassword: values.new_password
		}));
		console.log(update);

		// if update returns null, user entered wrong password
		if (update == null) {
			alert('Error: Incorrect password')
		}
		else {
			alert('profile update successful')
		}

		// prevent repeat actions
		actions.setFieldValue('current_password', '', true);
		actions.setFieldValue('new_password', '', true);

		actions.setSubmitting(false);
	}

	return (
		<div id="user-profile" className="body-wrapper auth">
			<div className="flex-container sidebar">
				<div className="sticky-wrapper">
					<Navigation />
				</div>
			</div>

			<div className="flex-container main">
				<div className="main-bg" />
				<div className="main">
					<TitleArea />

						<div className="ptitle">
							<h2>Your User Profile</h2>
						</div>
							<Formik<ProfileFields>
								initialValues={{
									username: '',
									first_name: '',
									last_name: '',
									address1: '',
									address2: '',
									city: '',
									state: '',
									zip: '',
									current_password: '',
									new_password: ''
								}}
								validationSchema={Yup.object({
									username: Yup.string(), // cant change username anyway
									first_name: Yup.string()
										.max(100, 'Must be less than 100 characters')
										.typeError('Required')
										.required('Required'),
									last_name: Yup.string()
										.max(100, 'Must be less than 100 characters')
										.typeError('Required')
										.required('Required'),
									address1: Yup.string()
										.max(100, 'Must be less than 100 characters')
										.typeError('Required')
										.required('Required'),
									address2: Yup.string()
										.nullable(true)
										.max(100, 'Must be less than 100 characters'),
									city: Yup.string()
										.max(100, 'Must be less than 100 characters')
										.typeError('Required')
										.required('Required'),
									state: Yup.string()
										.min(2)
										.max(2, 'Please use your state\'s abbreviation.')
										.typeError('Required')
										.required('Required'),
									zip: Yup.string()
										.max(100, 'Must be less than 100 characters')
										.typeError('Required')
										.matches(/[0-9]{5}/, 'Must be a 5 digit number')
										.required('Required'),
									current_password: Yup.string()
										.typeError('Required')
										.required('Required'),
								})}
								enableReinitialize
								onSubmit={onSubmit}
								>
							{({ isSubmitting, isValid, errors, touched, values }) => (
							<Form id="profile-form" className="userform">
								<div id="profile-wrapper">
										<DataFetcher />
										<div className="field-row">
											<div id="uname" className="field floating-label">
												<Field component={ValidationBox} name="username" className="floating-label" placeholder="username" type="text" disabled />
												<div className="label-wrapper"><label className="floating-label" htmlFor="username">Username</label></div>
												{errors.username && touched.username ? <span className="errors">{errors.username}</span> : <></>}
											</div>
										</div>

										<div className="field-row">
											<div className="grid-container fnln">
												<div id="fname" className="field floating-label">
													<Field component={ValidationBox} name="first_name" className="floating-label" placeholder="First Name" type="text" disabled={isSubmitting} />
													<div className="label-wrapper"><label className="floating-label" htmlFor="first_name">First Name</label></div>
													{errors.first_name && touched.first_name ? <span className="errors">{errors.first_name}</span> : <></>}
												</div>

												<div id="lname" className="field floating-label">
													<Field component={ValidationBox} name="last_name" className="floating-label" placeholder="Last Name" type="text" disabled={isSubmitting} />
													<div className="label-wrapper"><label className="floating-label" htmlFor="last_name">Last Name</label></div>
													{errors.last_name && touched.last_name ? <span className="errors">{errors.last_name}</span> : <></>}
												</div>
											</div>
										</div> 

										<div className="field-row">
											<div id="add1" className="field floating-label">
												<Field component={ValidationBox} name="address1" className="floating-label" placeholder="Address 1" type="text" disabled={isSubmitting} />
											<div className="label-wrapper"><label className="floating-label" htmlFor="address1">Address 1</label></div>
											{errors.address1 && touched.address1 ? <span className="errors">{errors.address1}</span> : <></>}
											</div>
										</div>
	
										<div className="field-row">
											<div id="add2" className="field floating-label">
												<Field component={ValidationBox} name="address2" className="floating-label" placeholder="Address 2" type="text" disabled={isSubmitting} />
												<div className="label-wrapper"><label className="floating-label" htmlFor="address2">Address 2 (Optional)</label></div>
												{errors.address2 && touched.address2 ? <span className="errors">{errors.address2}</span> : <></>}
											</div>
										</div>

										<div className="field-row">
											<div className="grid-container csz">
												<div id="city" className="field floating-label">
													<Field component={ValidationBox} name="city" className="floating-label" placeholder="City" type="text" disabled={isSubmitting} />
													<div className="label-wrapper"><label className="floating-label" htmlFor="city">City</label></div>
													{errors.city && touched.city ? <span className="errors">{errors.city}</span> : <></>}
												</div>

											<div id="state" className="field floating-label">
												<Field component={DropDown} name="state" options={states} maxLength={2} className="select floating-label" placeholder="" />
												{/*<div className="label-wrapper"><label className="floating-label" htmlFor="state">State</label></div>*/}
													{ errors.state ? <span className="errors">{errors.state}</span> : <></>}
											</div>

												<div id="zip" className="field floating-label">
													<Field component={ValidationBox} name="zip" className="floating-label" placeholder="zip" type="text" maxLength={5} disabled={isSubmitting} />
													<div className="label-wrapper"><label className="floating-label" htmlFor="zip">Zip Code</label></div>
													{errors.zip && touched.zip ? <span className="errors">{errors.zip}</span> : <></>}
												</div>
											</div>
										</div>

										<div className="field-row">
											<div id="current-pw" className="field floating-label">
												<Field component={ValidationBox} name="current_password" className="floating-label" placeholder="Current password" type="password" disabled={isSubmitting} />
												<div className="label-wrapper"><label htmlFor="current_password" className="floating-label">Current Password</label></div>
											</div>
										</div>

										<div className="field-row">
											<div id="new-pw" className="field floating-label">
												<Field name="new_password" className="floating-label" placeholder="New password" type="password" disabled={isSubmitting} />
											<div className="label-wrapper"><label htmlFor="new_password" className="floating-label">New Password</label></div>
											</div>

											<div className="hints">
													{values.new_password === "" || values.new_password === " " ? `Password won't be changed` : 'Password will be updated!'}
											</div>
									</div>
									
										<div className="button-area">
											<button className="form-button" type="submit" disabled={isSubmitting || !isValid}>Update</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
}