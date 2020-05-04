import axios from 'axios'

function axiosGet(url) {
  axios.get(url).then(
    res => {
      return res.data.result
    }
  ).catch(error => {
    alert(error.data.msg)
  })
}
