graphql`
  fragment CompleteNewMeetingFrag on NewMeeting {
    id
    facilitatorStageId
    facilitatorUserId
    facilitator {
      id
      preferredName
    }
    meetingNumber
    meetingType
    teamId
    phases {
      id
      phaseType
      stages {
        id
        isComplete
        isNavigable
        isNavigableByFacilitator
        ... on NewMeetingTeamMemberStage {
          teamMemberId
          teamMember {
            meetingMember {
              isCheckedIn
            }
            id
            picture
            preferredName
          }
        }
      }
      ... on CheckInPhase {
        checkInGreeting {
          content
          language
        }
        checkInQuestion
      }
      ... on ReflectPhase {
        focusedPhaseItemId
        reflectPrompts {
          question
        }
      }
      ... on DiscussPhase {
        stages {
          reflectionGroup {
            id
          }
          sortOrder
        }
      }
    }
    viewerMeetingMember {
      isCheckedIn
      ... on RetrospectiveMeetingMember {
        votesRemaining
      }
    }
    ... on RetrospectiveMeeting {
      reflectionGroups {
        ...CompleteReflectionGroupFrag @relay(mask: false)
        reflections {
          ...CompleteReflectionFrag @relay(mask: false)
        }
        tasks {
          ...CompleteTaskFrag @relay(mask: false)
        }
      }
      votesRemaining
      settings {
        maxVotesPerGroup
        totalVotes
      }
    }
  }
`
