import {GraphQLObjectType} from 'graphql'
import StandardMutationError from 'server/graphql/types/StandardMutationError'
import ReflectTemplate from './ReflectTemplate'

const RemoveReflectTemplatePromptPayload = new GraphQLObjectType({
  name: 'RemoveReflectTemplatePromptPayload',
  fields: () => ({
    error: {
      type: StandardMutationError
    },
    reflectTemplate: {
      type: ReflectTemplate,
      resolve: ({templateId}, _args, {dataLoader}) => {
        if (!templateId) return null
        return dataLoader.get('reflectTemplates').load(templateId)
      }
    },
    prompt: {
      type: ReflectTemplate,
      resolve: ({promptId}, _args, {dataLoader}) => {
        if (!promptId) return null
        return dataLoader.get('customPhaseItems').load(promptId)
      }
    }
  })
})

export default RemoveReflectTemplatePromptPayload
