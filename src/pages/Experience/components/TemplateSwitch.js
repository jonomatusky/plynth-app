import Template0 from 'templates/Template0/Template0'

const TemplateSwitch = ({ experience }) => {
  const templateId = (experience || {}).templateId

  switch (templateId) {
    case 0:
      return <Template0 experience={experience} />
    default:
      return <Template0 experience={experience} />
  }
}

export default TemplateSwitch
