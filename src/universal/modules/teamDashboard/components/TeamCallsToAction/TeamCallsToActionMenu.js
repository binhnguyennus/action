// @flow
import React from 'react'
import {meetingTypeToSlug} from 'universal/utils/meetings/lookups'
import {ACTION, RETROSPECTIVE} from 'universal/utils/constants'
import MenuWithShortcuts from 'universal/components/MenuWithShortcuts'
import MenuItemWithShortcuts from 'universal/components/MenuItemWithShortcuts'
import type {RouterHistory} from 'react-router-dom'
import {withRouter} from 'react-router-dom'

type Props = {
  closePortal: () => void,
  history: RouterHistory,
  teamId: string
}

const TeamCallsToActionMenu = (props: Props) => {
  const {closePortal, history, teamId} = props

  const goToMeetingLobby = () => {
    const slug = meetingTypeToSlug[ACTION]
    history.push(`/${slug}/${teamId}/`)
  }

  const goToRetroLobby = () => {
    const slug = meetingTypeToSlug[RETROSPECTIVE]
    history.push(`/${slug}/${teamId}/`)
  }

  return (
    <MenuWithShortcuts
      ariaLabel={'Select the meeting you would like start'}
      closePortal={closePortal}
    >
      <MenuItemWithShortcuts
        icon='change_history'
        label='Start Action Meeting'
        onClick={goToMeetingLobby}
      />
      <MenuItemWithShortcuts icon='history' label='Start Retro Meeting' onClick={goToRetroLobby} />
    </MenuWithShortcuts>
  )
}

export default withRouter(TeamCallsToActionMenu)
