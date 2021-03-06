import sendEmail from 'server/email/sendEmail'
import templates from 'server/email/templates'
import {RETROSPECTIVE} from 'universal/utils/constants'
import makeAppLink from 'server/utils/makeAppLink'

const EMAIL_DESTINATION = 'terry@parabol.co'

const ORG_MEMBERS_LINK = makeAppLink('me/organizations/tzsqFnuzh/members')

const EMAIL_ALL_PROPS = {
  summaryEmail: {
    meeting: {
      teamName: 'Team 123',
      endedAt: new Date().toJSON(),
      agendaItemsCompleted: 3,
      invitees: []
    }
  },
  newMeetingSummaryEmailCreator: {
    meeting: {
      id: 'HyluTLr5J',
      meetingType: RETROSPECTIVE,
      team: {
        id: 'team123',
        name: 'Team 123'
      },
      endedAt: new Date(),
      meetingMembers: [],
      reflectionGroups: []
    }
  },
  notificationSummary: {
    userId: '123',
    email: 'fake@123.co',
    name: 'First Last',
    numNotifications: '4'
  },
  teamInvite: {
    inviteLink: '#inviteLink',
    inviteeName: undefined,
    inviteeEmail: 'nolan@example.co',
    inviterName: 'Sara',
    inviterEmail: 'sara@example.co',
    teamName: 'Example Team'
  },
  UpcomingInvoiceEmailTemplate: {
    memberUrl: ORG_MEMBERS_LINK,
    periodEndStr: 'January 31',
    newUsers: [
      {
        email: 'nolan@company.co',
        name: 'Nolan'
      },
      {
        email: 'sara@another.co',
        name: 'Sara'
      }
    ]
  }
}
export default async function emailSSR (req, res) {
  const {template} = req.params
  const emailFactory = templates[template]
  const props = EMAIL_ALL_PROPS[template]
  /*
   * Render and send email
   *
   * Don't forget to set the MAILGUN_API_KEY, MAILGUN_DOMAIN, and MAILGUN_FROM
   * environment variables if you want to send the email for reals.
   */
  await sendEmail(EMAIL_DESTINATION, template, props)

  // Render and show container:
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.send(emailFactory(props).html)
}
