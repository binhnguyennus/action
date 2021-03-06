import {ReflectTemplateModal_retroMeetingSettings} from '__generated__/ReflectTemplateModal_retroMeetingSettings.graphql'
import memoize from 'micro-memoize'
import React, {Component} from 'react'
import styled from 'react-emotion'
import {commitLocalUpdate, createFragmentContainer, graphql} from 'react-relay'
import {PALETTE} from 'universal/styles/paletteV2'
import {typeScale} from 'universal/styles/theme/typography'
import Overflow from 'universal/components/Overflow'
import TextOverflow from 'universal/components/TextOverflow'
import withAtmosphere, {
  WithAtmosphereProps
} from 'universal/decorators/withAtmosphere/withAtmosphere'
import ui from 'universal/styles/ui'
import AddNewReflectTemplate from './AddNewReflectTemplate'
import AddTemplatePrompt from './AddTemplatePrompt'
import EditableTemplateName from './EditableTemplateName'
import RemoveTemplate from './RemoveTemplate'
import TemplatePromptList from './TemplatePromptList'

interface Props extends WithAtmosphereProps {
  onSuccess: () => void
  retroMeetingSettings: ReflectTemplateModal_retroMeetingSettings
}

const contentPaddingLeft = '3rem'

const ModalBoundary = styled('div')({
  background: ui.palette.white,
  borderRadius: ui.modalBorderRadius,
  display: 'flex',
  height: 374,
  width: 700
})

const TemplateSidebar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: PALETTE.BACKGROUND.MAIN,
  borderRadius: `${ui.modalBorderRadius} 0 0 ${ui.modalBorderRadius}`,
  width: '12.5rem'
})

const Label = styled('div')({
  color: PALETTE.TEXT.LIGHT,
  borderBottom: `.0625rem solid ${PALETTE.BORDER.LIGHT}`,
  fontSize: typeScale[1],
  fontWeight: 600,
  lineHeight: '1.5',
  padding: '.75rem 1rem',
  textTransform: 'uppercase',
  width: '100%'
})

const ListAndAdd = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  padding: '.5rem'
})

const TemplateList = styled('ul')({
  listStyle: 'none',
  margin: '0 0 .5rem',
  padding: 0
})

const TemplateItem = styled('li')(({isActive}: {isActive: boolean}) => ({
  backgroundColor: isActive ? PALETTE.BACKGROUND.MAIN_DARKENED : undefined,
  borderRadius: '.125rem',
  cursor: 'pointer',
  fontSize: typeScale[3],
  lineHeight: '1.375rem',
  padding: '.3125rem .5rem'
}))

const TemplateHeader = styled('div')({
  alignItems: 'center',
  display: 'flex',
  margin: '1rem 0',
  paddingLeft: contentPaddingLeft,
  paddingRight: '2rem',
  width: '100%'
})

const PromptEditor = styled('div')({
  flex: 1,
  width: '100%'
})

class ReflectTemplateModal extends Component<Props> {
  constructor (props) {
    super(props)
    const {atmosphere, retroMeetingSettings} = props
    const {settingsId, selectedTemplateId} = retroMeetingSettings
    commitLocalUpdate(atmosphere, (store) => {
      const settings = store.get(settingsId)
      if (!settings) return
      settings.setValue(selectedTemplateId, 'activeTemplateId')
    })
  }

  editTemplate = (templateId: string) => () => {
    const {atmosphere, retroMeetingSettings} = this.props
    const {settingsId} = retroMeetingSettings
    commitLocalUpdate(atmosphere, (store) => {
      const settings = store.get(settingsId)
      if (!settings) return
      settings.setValue(templateId, 'activeTemplateId')
    })
  }

  sortedTemplates = memoize(
    (reflectTemplates: ReflectTemplateModal_retroMeetingSettings['reflectTemplates']) => {
      const templates = reflectTemplates.slice()
      templates.sort((a, b) => (a.name < b.name ? -1 : 1))
      return templates
    }
  )

  render () {
    const {retroMeetingSettings} = this.props
    const {activeTemplateId, reflectTemplates, teamId} = retroMeetingSettings
    const templateCount = reflectTemplates.length
    const sortedTemplates = this.sortedTemplates(reflectTemplates)
    const activeTemplate = reflectTemplates.find((template) => template.id === activeTemplateId)
    if (!activeTemplate) return null
    return (
      <ModalBoundary>
        <TemplateSidebar>
          <Label>Templates</Label>
          <ListAndAdd>
            <Overflow>
              <TemplateList>
                {sortedTemplates.map((template) => {
                  return (
                    <TemplateItem
                      key={template.id}
                      isActive={template.id === activeTemplate.id}
                      onClick={this.editTemplate(template.id)}
                    >
                      <TextOverflow>{template.name}</TextOverflow>
                    </TemplateItem>
                  )
                })}
              </TemplateList>
            </Overflow>
            {/* add a key to clear the error when they change */}
            <AddNewReflectTemplate
              key={activeTemplate.id}
              teamId={teamId}
              reflectTemplates={reflectTemplates}
            />
          </ListAndAdd>
        </TemplateSidebar>
        <PromptEditor>
          <TemplateHeader>
            <EditableTemplateName
              key={activeTemplate.id}
              name={activeTemplate.name}
              templateId={activeTemplate.id}
              templates={sortedTemplates}
            />
            <RemoveTemplate templateCount={templateCount} templateId={activeTemplate.id} />
          </TemplateHeader>
          <TemplatePromptList prompts={activeTemplate.prompts} templateId={activeTemplate.id} />
          <AddTemplatePrompt templateId={activeTemplate.id} prompts={activeTemplate.prompts} />
        </PromptEditor>
      </ModalBoundary>
    )
  }
}

export default createFragmentContainer(
  withAtmosphere(ReflectTemplateModal),
  graphql`
    fragment ReflectTemplateModal_retroMeetingSettings on RetrospectiveMeetingSettings {
      settingsId: id
      reflectTemplates {
        ...AddNewReflectTemplate_reflectTemplates
        id
        name
        prompts {
          ...TemplatePromptList_prompts
          ...AddTemplatePrompt_prompts
          id
          sortOrder
        }
      }
      activeTemplateId
      selectedTemplateId
      teamId
    }
  `
)
