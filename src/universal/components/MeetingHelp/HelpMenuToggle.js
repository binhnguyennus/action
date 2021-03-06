import IconLabel from 'universal/components/IconLabel'
import React from 'react'
import styled from 'react-emotion'
import FloatingActionButton from 'universal/components/FloatingActionButton'
import {meetingHelpWithBottomBar} from 'universal/styles/meeting'
import withInnerRef from 'universal/decorators/withInnerRef'

const StyledButton = styled(FloatingActionButton)(({floatAboveBottomBar}) => ({
  bottom: floatAboveBottomBar ? meetingHelpWithBottomBar : '1.25rem',
  height: '2rem',
  paddingLeft: 0,
  paddingRight: 0,
  position: 'fixed',
  right: '1.25rem',
  width: '2rem',
  zIndex: 200
}))

const HelpMenuToggle = (props) => {
  return (
    <StyledButton palette='white' {...props} innerRef={props.toggleRef}>
      <IconLabel icon='help_outline' />
    </StyledButton>
  )
}

export default withInnerRef(HelpMenuToggle)
