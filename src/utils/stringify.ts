const stringify = ( content: object ) => {
  const uid = Math.random().toString(36).substring(2)
  const functions = []

  const replacer = ( key: string, value: any ) => {
    if ( Array.isArray(value) && value[0] === '@@/ga-function' ) {
      return `@@/ga-${uid}/F${functions.push(Function(...value[1])) - 1}`
    }

    return value
  }

  return JSON.stringify(content, replacer)
    // Replace functions as is
    .replace(
      new RegExp(`"@@/ga-${uid}/F(\\d+)"`, 'g'),
      ( _, index ) => functions[index].toString()
        .replace(/(function) anonymous(\()/g, '$1$2')
        .replace(new RegExp('/\\*``\\*/', 'g'), '')
    )
    // Remove quotes around keys
    .replace(/"(\w+)"\s*:/g, '$1:')
}

export default stringify
