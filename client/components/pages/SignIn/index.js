import React from 'react'
import {
  Row,
  Col,
} from 'reactstrap'
import SignInForm from './SignInForm'
import ForgottenPasswordForm from './ForgottenPasswordForm'
import { withRouter } from 'react-router'
import './sign-in.scss'

class SignIn extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      showResetPasswordForm: false
    }
  }

  render() {
    let { history } = this.props
    return (
      <Row>
        <Col
          lg={{ size: 4, offset: 4 }}
          md={{ size: 6, offset: 3 }}
          sm={{ size: 8, offset: 2 }}
        >
          <SignInForm />

          <div id="forgotten-password-area" className="text-center mb-5">
            <div>
              <a
                href=""
                onClick={
                  e => {
                    e.preventDefault()
                    this.setState({ showResetPasswordForm: !this.state.showResetPasswordForm })
                  }
                }>
                  {t(`sign-in-page.forgot-password.title`, `Mot de passe oublié ?`)}
                </a>
            </div>

            {
              this.state.showResetPasswordForm &&
              <div className="mt-5">
                <div className="reset-password-instructions mb-2">
                  {t(`sign-in-page.forgot-password.instructions`, `Pas de panique, entre ton mail et tu en recevras un nouveau !`)}</div>
                <ForgottenPasswordForm />
              </div>
            }
          </div>

        </Col>
      </Row>
    )
  }
}


export default withRouter(SignIn)
