const fs = require('fs')
const readline = require('readline')

const checkEnvFileExists = () => {
  return fs.existsSync('.env')
}

const promptOverrideEnvFile = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('.env file already exists. Do you want to override it? (y/n): ', (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y')
    })
  })
}

const generateEnvFile = () => {
  const envContent = 'DATABASE=database'

  if (checkEnvFileExists()) {
    promptOverrideEnvFile().then((shouldOverride) => {
      if (shouldOverride) {
        writeEnvFile(envContent)
      } else {
        console.log('Skipping .env file generation.')
      }
    })
  } else {
    writeEnvFile(envContent)
  }
}

const writeEnvFile = (content) => {
  fs.writeFile('.env', content, (err) => {
    if (err) {
      console.error('An error occurred while generating the .env file:', err)
    } else {
      console.log('.env file generated successfully.')
    }
  })
}

generateEnvFile()
