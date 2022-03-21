import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Markdown from 'utils/Markdown'

function UploadsPanicMessageMaybe({ participationId }) {
  const { data: userData, loading: userLoading, error: userError } = useQuery(gql`
    query Code($participationId: ID!) {
      participation(id: $participationId) {
        id
        user {
          id
          slug
        }
      }
    },
  `, { variables: { participationId }})
  const { data, loading, error } = useQuery(gql`
    query UploadsPanicMessage {
      config {
        uploadsPanicMessage
      }
    }
  `, { pollInterval: 30*1000 })
  if (loading || error) return null
  let message = data.config.uploadsPanicMessage
  if (!message) return null
  if (userLoading || userError) return null
  message = message.replace('%CODE%', `${userData.participation.user.slug}-${participationId}`)
  return (
    <div className="post-it-info mb-4 text-left" style={{ fontSize: "0.9rem" }}>
      <div dangerouslySetInnerHTML={{__html: message }} />
      {/* <Markdown>
        {`<div class="text-center mb-2">
<h3>Ça bouchonne !</h3>
<div>Tu n'arrives pas à envoyer tes planches ? voici la marche à suivre :</div>
</div>
- si ça prend du temps c'est normal, le serveur reçoit en ce moment beaucoup de requêtes, évite donc de répéter en boucle la manip d'envoi de planches, ça ne fera qu'empirer les choses
- si à 13h tu as loupé ta tortue d'or à cause des problèmes de serveur, nous pourrons te la restituer, il faut juste envoyer un mail à [dev@23hbd.com](mailto:dev@23hbd.com) contenant :
    - un screenshot de tes 12 planches (une vue d'ensemble suffit)
    - ce code : \`%CODE%\``}
      </Markdown> */}
    </div>
  )
}

export default UploadsPanicMessageMaybe

