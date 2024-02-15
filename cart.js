// import userProductModal from './userProductModal.js';
const modals = {
  data() {
    return {
      qty: 1,
      modal: ''
    }
  },
  props:['tempProduct'],
  template: '#userProductModal',
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.exampleModal, {
      keyboard: false,
      backdrop: 'static'
    });
  },
  watch: {
    tempProduct(){
      this.qty = 1;
    }
  },
  methods: {
    openModal(){
      this.modal.show()
    },
    closeModal(){
      this.modal.hide()
    }
  },
}
const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://ec-course-api.hexschool.io/v2',
      apiPath: 'leo535',
      products: [],
      product: {},
      cart: {},
      isLoadingStatus:{
        isLoading: false,
        cartLoading: ''
      },
      productModal:'',
      form:{
        email:'',
        name:'',
        phone: '',
        address:'',
        msg: ''
      }
    }
  },
  methods: {
    getProducts(){
      this.isLoadingStatus.isLoading = true;
      axios.get(`${this.apiUrl}/api/${this.apiPath}/products`)
      .then((res)=>{
        this.products = res.data.products
        this.isLoadingStatus.isLoading = false;
        // console.log(this.products);
      })
      .catch((err)=>{
        alert(err.data.message)
        console.log(err.data);
      })
    },
    getProduct(product_id){
      this.isLoadingStatus.isLoading = true;
      this.isLoadingStatus.ItemId = product_id;
      axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${product_id}`)
      .then((res)=>{
        this.product = res.data.product
        this.isLoadingStatus.isLoading = false;
        this.isLoadingStatus.ItemId = ''
        this.$refs.userProductModal.openModal();

      })
      .catch((err)=>{
        alert(err.data.message)
        // console.log(err.data);
      })
    },
    addToCart(product_id,qty=1){
      // this.isLoadingStatus.isLoading = true
      const cart = {
        data:{
          product_id,
          qty
        }
      }
      this.isLoadingStatus.ItemId = product_id;
      axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`,cart)
      .then((res)=>{
        alert(res.data.message)
        // console.log(res.data);
        this.getCarts();
        // this.isLoadingStatus.isLoading = false
        this.isLoadingStatus.ItemId = ''
        this.$refs.userProductModal.closeModal();
        // console.log(this.isLoadingStatus.ItemId);
      })
      .catch((err)=>{
        alert(err.data.message)
        // console.log(err.data);
      })
    },
    getCarts(){
      // this.isLoadingStatus.isLoading = true;
      axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
      .then((res)=>{
        // this.isLoadingStatus.isLoading = false;
        this.cart = res.data.data;
      })
      .catch((err)=>{
        alert(err.data.message)
        // console.log(err.data);
      })
    },
    changeToCart(item,qty=1){
      // this.isLoadingStatus.isLoading = true
      const order = {
        data:{
          product_id: item.product_id,
          qty
        }
      }
      this.isLoadingStatus.cartLoading = item.id;
      axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`,order)
      .then((res)=>{
        alert(res.data.message)
        // console.log(res.data);
        this.getCarts();
        // this.isLoadingStatus.isLoading = false
        this.isLoadingStatus.cartLoading = ''
        this.$refs.userProductModal.closeModal();
        // console.log(this.isLoadingStatus.ItemId);
      })
      .catch((err)=>{
        alert(err.data.message)
        // console.log(err.data);
      })
    },
    deleteCart(cart_id){
      this.isLoadingStatus.isLoading = true;
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${cart_id}`)
        .then((res)=>{
          this.isLoadingStatus.isLoading = false;
          alert('該商品'+ res.data.message);
          this.getCarts();
        })
        .catch((err)=>{
          alert(err.data.message)
          // console.log(err.data);
        })
    },
    deleteAllCarts(){
      this.isLoadingStatus.isLoading = true;
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
        .then((res)=>{
          this.isLoadingStatus.isLoading = false;
          alert('購物車列表'+ res.data.message);
          this.getCarts();
        })
        .catch((err)=>{
          alert(err.data.message)
          // console.log(err.data);
        })
    },
    sendOrder(){
      const data={
        "user": {
          "name": this.form.name,
          "email": this.form.email,
          "tel": this.form.tel,
          "address": this.form.address
        },
        "message": this.form.msg
    }
      // this.$refs.form.resetForm()
      axios.post(`${this.apiUrl}/api/${this.apiPath}/order`,{data})
      .then((res)=>{
        this.isLoadingStatus.isLoading = false;
        console.log(res.data);
        alert(res.data.message);
        this.$refs.form.resetForm();
        this.getCarts();
      })
      .catch((err)=>{
        alert(err.data)
        // console.log(err.data);
      })
    }
  },
  mounted() {
    this.getProducts();
    this.getCarts();
    // console.log(this.$refs);
  },
  components:{
    modals
  }
})
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL(
  "./zh_TW.json"
);

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize(
    "zh_TW"
  ),
  validateOnInput: true // 調整為：輸入文字時，就立即進行驗證
});
// app.component('modals',userProductModal)
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.component("VForm", VeeValidate.Form);
app.component('loading',VueLoading.Component);
app.mount('#app')