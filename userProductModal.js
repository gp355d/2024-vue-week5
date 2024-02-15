export default {
  template: '#userProductModal',
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.exampleModal, {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    openModal(){
      this.modal.show()
    }
  },
}