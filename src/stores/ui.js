import { defineStore } from "pinia";

const emptyItem = () => ({
  merchant_id: "",
  url: "",
  product_name: "",
  product_description: "",
  reference: "",
  quantity: 1,
});

const emptyMerchant = () => ({
  site_name: "",
  site_base_url: "",
  country: "",
  default_currency: "",
  description: "",
  product_url_pattern: "",
  category_url_pattern: "",
});

export const useUiStore = defineStore("ui", {
  state: () => ({
    showItemModal: false,
    showMerchantModal: false,
    itemDraft: emptyItem(),
    merchantDraft: emptyMerchant(),
    returnToItemAfterMerchant: false,
  }),
  actions: {
    openItemModal(draft = {}, defaultMerchantId = "") {
      this.itemDraft = { ...emptyItem(), ...draft };
      if (!this.itemDraft.merchant_id && defaultMerchantId) {
        this.itemDraft.merchant_id = defaultMerchantId;
      }
      this.returnToItemAfterMerchant = false;
      this.showItemModal = true;
    },
    closeItemModal() {
      this.showItemModal = false;
    },
    openMerchantModal(draft = {}) {
      this.merchantDraft = { ...emptyMerchant(), ...draft };
      this.returnToItemAfterMerchant = false;
      this.showMerchantModal = true;
    },
    openMerchantFromItem(itemDraft) {
      this.itemDraft = { ...emptyItem(), ...itemDraft };
      this.returnToItemAfterMerchant = true;
      this.merchantDraft = emptyMerchant();
      this.showItemModal = false;
      this.showMerchantModal = true;
    },
    closeMerchantModal() {
      this.showMerchantModal = false;
      this.returnToItemAfterMerchant = false;
    },
    onMerchantCreated(id) {
      if (this.returnToItemAfterMerchant) {
        this.itemDraft = { ...this.itemDraft, merchant_id: id };
        this.showMerchantModal = false;
        this.showItemModal = true;
        this.returnToItemAfterMerchant = false;
      } else {
        this.showMerchantModal = false;
      }
    },
  },
});
