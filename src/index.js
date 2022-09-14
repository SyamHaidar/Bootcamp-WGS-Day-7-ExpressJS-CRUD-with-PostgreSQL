const express = require('express')
// EJS
const expressLayouts = require('express-ejs-layouts')
// morgan logger
const morgan = require('morgan')
// validator
const validator = require('validator')
// contact controller
const {
  getAllContact,
  getContactName,
  saveContact,
  updateContact,
  deleteContact,
} = require('./controllers/Contacts')

// -----------------------------------------------------------------------------

const app = express()
const port = 3000

// middleware
app.use(express.urlencoded({ extended: true })) // parse the incoming request
app.use('/public', express.static('public')) // serve static files
app.use(morgan('dev')) // log requests and errors
app.use(express.json()) // parses incoming requests with JSON

// EJS
app.set('views', 'src/views', { root: __dirname }) // ejs views folfer dir
app.set('view engine', 'ejs')
app.use(expressLayouts)

// message
let errorMsg = { name: '', email: '', mobile: '' }
let successMsg = { save: '', update: '', delete: '' }
let editData = { oldName: '', name: '', email: '', mobile: '' }

// -----------------------------------------------------------------------------

// --- HOME ---
app.get('/', (req, res) => {
  res.render('index', {
    title: 'BootcampWGS.com',
    page: 'home',
  })
})

// --- CONTACT ---
app.get('/contact', async (req, res) => {
  const contacts = await getAllContact()

  res.render('contact', {
    title: 'Contact - BootcampWGS.com',
    page: 'contact',
    message: { error: errorMsg, success: successMsg },
    data: contacts,
  })

  // clear message when page reloaded
  errorMsg = { name: '', email: '', mobile: '' }
  successMsg = { save: '', update: '', delete: '' }
})

// --- CONTACT Save ---
app.post('/contact', async (req, res) => {
  const contact = await getContactName(req.body.name)

  // check if new data not exist
  if (contact) {
    errorMsg.name = 'Contact Name already recorded. Please use another name'
  }

  // check if email valid
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      errorMsg.email = 'Please input correct email'
    }
  }

  // check if phone number valid
  if (!validator.isMobilePhone(req.body.mobile, ['id-ID'])) {
    errorMsg.mobile = 'Please input correct phone number'
  }

  // check if all input data corect and valid
  if (
    !contact &&
    validator.isEmail(req.body.email) &&
    validator.isMobilePhone(req.body.mobile, ['id-ID'])
  ) {
    // if success send message and save data
    await saveContact(req.body.name, req.body.mobile, req.body.email)
    successMsg.save = 'Data saved!'
  }

  res.redirect('/contact')
})

// --- CONTACT Edit ---
app.get('/contact/:name/edit', async (req, res) => {
  const contacts = await getContactName(req.params.name)

  res.render('contactEdit', {
    title: 'Contact - BootcampWGS.com',
    page: 'contact',
    message: { error: errorMsg },
    data: contacts,
    editData: editData,
  })

  // clear message when page reloaded
  errorMsg = { name: '', email: '', mobile: '' }
  editData = { oldName: '', name: '', email: '', mobile: '' }
})

// --- CONTACT Update ---
app.post('/contact/update', async (req, res) => {
  const contact = await getContactName(req.body.name)

  // check if new name not exist
  if (contact) {
    errorMsg.name = 'Contact Name already recorded. Please use another name'
    editData.oldName = req.body.oldName
    editData.name = req.body.name
  }

  // check if email valid
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      errorMsg.email = 'Please input correct email'
      editData.email = req.body.email
    }
  }

  // check if phone number valid
  if (!validator.isMobilePhone(req.body.mobile, ['id-ID'])) {
    errorMsg.mobile = 'Please input correct phone number'
    editData.mobile = req.body.mobile
  }

  // check if all input data corect and valid
  if (
    !contact &&
    validator.isEmail(req.body.email) &&
    validator.isMobilePhone(req.body.mobile, ['id-ID'])
  ) {
    // if success send message and redirect to contact
    await updateContact(req.body.oldName, req.body.name, req.body.mobile, req.body.email)
    successMsg.update = 'Data updated!'
    res.redirect('/contact')
  } else {
    // if failed redirect to edit
    res.redirect(`/contact/${req.body.oldName}/edit`)
  }
})

// --- CONTACT Delete ---
app.get('/contact/:name/delete', async (req, res) => {
  await deleteContact(req.params.name)
  deleteMessage = 'Data deleted!'
  res.redirect('/contact')
})

// --- ABOUT ---
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - BootcampWGS.com',
    page: 'about',
  })
})

// ---------------------------------------------------------------------------

// --- 404 page ---
app.use('/', (req, res) => {
  res.status(404)
  res.render('404')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
