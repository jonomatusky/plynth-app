import Template0 from 'templates/Template0/Template0'

const TemplateSwitch = ({ experience }) => {
  switch (experience.templateId) {
    case 0:
      return <Template0 experience={experience} />
    default:
      return <Template0 experience={experience} />
  }
}

export default TemplateSwitch
