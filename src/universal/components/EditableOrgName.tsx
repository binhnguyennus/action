import React, {Component} from 'react'
import styled from 'react-emotion'
import {createFragmentContainer, graphql} from 'react-relay'
import EditableText from 'universal/components/EditableText'
import withAtmosphere, {
  WithAtmosphereProps
} from 'universal/decorators/withAtmosphere/withAtmosphere'
import withMutationProps, {WithMutationProps} from 'universal/utils/relay/withMutationProps'
import UpdateOrgMutation from '../mutations/UpdateOrgMutation'
import Legitity from '../validation/Legitity'
import {EditableOrgName_organization} from '__generated__/EditableOrgName_organization.graphql'

interface Props extends WithAtmosphereProps, WithMutationProps {
  organization: EditableOrgName_organization
}

const EditableOrgText = styled(EditableText)({
  fontSize: 32,
  lineHeight: '48px'
})

class EditableOrgName extends Component<Props> {
  handleSubmit = (rawName) => {
    const {
      atmosphere,
      onError,
      onCompleted,
      setDirty,
      submitMutation,
      submitting,
      organization
    } = this.props
    if (submitting) return
    setDirty()
    const {error, value: name} = this.validate(rawName)
    if (error) return
    submitMutation()
    const updatedOrg = {
      id: organization.id,
      name
    }
    UpdateOrgMutation(atmosphere, {updatedOrg}, {onError, onCompleted})
  }

  validate = (rawOrgName: string) => {
    const {error, onError} = this.props

    const res = new Legitity(rawOrgName)
      .trim()
      .required('“The nameless wonder” is better than nothing')
      .min(2, 'The “A Team” had a longer name than that')
      .max(50, 'That isn’t very memorable. Maybe shorten it up?')

    if (res.error) {
      onError(res.error)
    } else if (error) {
      onError()
    }
    return res
  }

  render () {
    const {error, organization} = this.props
    const {name} = organization
    return (
      <EditableOrgText
        error={error as string}
        handleSubmit={this.handleSubmit}
        initialValue={name}
        maxLength={50}
        validate={this.validate}
        placeholder={'Organization Name'}
      />
    )
  }
}

export default createFragmentContainer(
  withAtmosphere(withMutationProps(EditableOrgName)),
  graphql`
    fragment EditableOrgName_organization on Organization {
      id
      name
    }
  `
)
