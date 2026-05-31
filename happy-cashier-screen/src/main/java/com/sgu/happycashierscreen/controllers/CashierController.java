package com.sgu.happycashierscreen.controllers;

import com.sgu.happycashierscreen.dto.request.InvoiceCreationRequest;
import com.sgu.happycashierscreen.dto.request.InvoiceDetailCreationRequest;
import com.sgu.happycashierscreen.dto.request.ReviewDetailRequest;
import com.sgu.happycashierscreen.dto.request.ReviewRequest;
import com.sgu.happycashierscreen.dto.response.CustomerResponse;
import com.sgu.happycashierscreen.dto.response.InvoiceResponse;
import com.sgu.happycashierscreen.dto.response.ProductResponse;
import com.sgu.happycashierscreen.dto.response.ReviewDetailResponse;
import com.sgu.happycashierscreen.dto.response.ReviewResponse;
import com.sgu.happycashierscreen.services.CustomerService;
import com.sgu.happycashierscreen.services.InvoiceService;
import com.sgu.happycashierscreen.services.ProductService;
import com.sgu.happycashierscreen.util.ObjectMapperUtil;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.*;
import javafx.stage.Window;

import java.math.BigDecimal;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class CashierController implements Initializable {
    @FXML private Label storeNameLabel;
    @FXML private Label welcomeLabel;
    @FXML private Label dateLabel;
    @FXML private TextField productSearchField;
    @FXML private FlowPane productsGrid;
    @FXML private VBox cartItemsVBox;
    @FXML private Label subtotalLabel;
    @FXML private Label totalLabel;
    @FXML private TextField customerIdField;
    @FXML private TextArea shippingAddressField;

    /** Server {@code PaymentMethod} names: {@link #PAY_AT_COUNTER} for cash, {@link #CARD_LIKE} for card. */
    private static final String PAY_AT_COUNTER = "COD";
    private static final String CARD_LIKE = "QR_Scanning";

    private final List<ProductResponse> allProducts = new ArrayList<>();
    private final Map<UUID, CartItem> cart = new LinkedHashMap<>();

    private record CartItem(ProductResponse product, int quantity) {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        dateLabel.setText(new SimpleDateFormat("EEE, MMM d").format(new Date()));
        welcomeLabel.setText(buildWelcomeMessage());

        productSearchField.textProperty().addListener((obs, oldVal, newVal) -> renderProducts());

        loadProductsFromApi();
        updateCartDisplay();
    }

    private String buildWelcomeMessage() {
        var staff = AppState.getStaffUser();
        if (staff == null || staff.getUser() == null) {
            return "Welcome, Staff!";
        }
        var u = staff.getUser();
        String first = u.getFirstName() != null ? u.getFirstName() : "";
        String last = u.getLastName() != null ? u.getLastName() : "";
        String name = (first + " " + last).trim();
        return name.isEmpty() ? "Welcome, Staff!" : "Welcome, " + name + "!";
    }

    private void loadProductsFromApi() {
        new Thread(() -> {
            try {
                List<ProductResponse> list = ProductService.fetchAllProducts();
                Platform.runLater(() -> {
                    allProducts.clear();
                    allProducts.addAll(list);
                    renderProducts();
                });
            } catch (Exception e) {
                Platform.runLater(() -> {
                    new Alert(Alert.AlertType.ERROR,
                            "Failed to load products: " + e.getMessage()).showAndWait();
                });
            }
        }, "load-products").start();
    }

    private List<ProductResponse> filteredProducts() {
        String q = productSearchField != null ? productSearchField.getText() : "";
        if (q == null || q.isBlank()) {
            return new ArrayList<>(allProducts);
        }
        String needle = q.trim().toLowerCase(Locale.ROOT);
        return allProducts.stream()
                .filter(p -> matchesSearch(p, needle))
                .collect(Collectors.toList());
    }

    private boolean matchesSearch(ProductResponse p, String needle) {
        if (p.getId() != null && p.getId().toString().toLowerCase(Locale.ROOT).contains(needle)) {
            return true;
        }
        if (contains(p.getName(), needle)) return true;
        if (contains(p.getDescription(), needle)) return true;
        if (contains(p.getCategoryName(), needle)) return true;
        if (contains(p.getCategoryId(), needle)) return true;
        if (contains(p.getBrand(), needle)) return true;
        if (contains(p.getOrigin(), needle)) return true;
        if (contains(p.getUnit(), needle)) return true;
        if (p.getPrice() != null && p.getPrice().toPlainString().toLowerCase(Locale.ROOT).contains(needle)) {
            return true;
        }
        return false;
    }

    private boolean contains(String value, String needle) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(needle);
    }

    /** Hiển thị mã sản phẩm (UUID từ server; chưa có SKU riêng trong API). */
    private static String formatProductCode(UUID id) {
        return id != null ? id.toString() : "—";
    }

    /**
     * Ảnh sản phẩm từ URL; nếu không có URL hoặc lỗi tải thì hiển thị icon 📦.
     */
    private Node buildProductImageNode(String imageUrl, double fitW, double fitH, String placeholderFontSize) {
        Label placeholder = new Label("📦");
        placeholder.setStyle("-fx-font-size: " + placeholderFontSize + ";");
        placeholder.setAlignment(Pos.CENTER);
        placeholder.setMinSize(fitW, fitH);
        placeholder.setMaxSize(fitW, fitH);

        if (imageUrl == null || imageUrl.isBlank()) {
            return placeholder;
        }

        Image image = new Image(imageUrl.trim(), fitW, fitH, true, true, true);
        ImageView imageView = new ImageView(image);
        imageView.setFitWidth(fitW);
        imageView.setFitHeight(fitH);
        imageView.setPreserveRatio(true);
        imageView.setSmooth(true);
        imageView.setVisible(false);

        StackPane stack = new StackPane(placeholder, imageView);
        stack.setAlignment(Pos.CENTER);
        stack.setMinSize(fitW, fitH);
        stack.setMaxSize(fitW, fitH);

        Runnable applyWhenLoaded = () -> {
            if (image.isError()) {
                imageView.setVisible(false);
                placeholder.setVisible(true);
            } else {
                placeholder.setVisible(false);
                imageView.setVisible(true);
            }
        };
        image.progressProperty().addListener((obs, oldV, progress) -> {
            if (progress != null && progress.doubleValue() >= 1.0) {
                Platform.runLater(applyWhenLoaded);
            }
        });
        if (image.getProgress() >= 1.0) {
            Platform.runLater(applyWhenLoaded);
        }

        return stack;
    }

    private void renderProducts() {
        productsGrid.getChildren().clear();
        for (ProductResponse p : filteredProducts()) {
            VBox card = new VBox(5);
            card.getStyleClass().add("product-card");
            card.setPadding(new Insets(12));
            card.setPrefWidth(160);

            if (!p.isAvailable()) {
                card.setOpacity(0.55);
            }

            Node imageNode = buildProductImageNode(p.getImageUrl(), 140, 100, "32px");

            Label codeLabel = new Label("Mã SP:\n" + formatProductCode(p.getId()));
            codeLabel.setWrapText(true);
            codeLabel.setMaxWidth(140);
            codeLabel.setStyle("-fx-font-size: 10px; -fx-text-fill: rgb(107, 114, 128);");

            Label name = new Label(p.getName() != null ? p.getName() : "(no name)");
            name.setWrapText(true);
            name.setMaxWidth(140);
            BigDecimal priceBd = p.getPrice();
            String priceStr = priceBd != null ? String.format("$%.2f", priceBd.doubleValue()) : "—";
            Label price = new Label(priceStr);
            price.setStyle("-fx-font-weight: bold; -fx-text-fill: rgb(234, 88, 12);");

            Label stock = new Label("Stock: " + p.getQuantity());
            stock.setStyle("-fx-font-size: 11px; -fx-text-fill: rgb(107, 114, 128);");
            card.getChildren().addAll(imageNode, codeLabel, name, price, stock);

            UUID id = p.getId();
            if (id != null && p.isAvailable()) {
                card.setOnMouseClicked(e -> addToCart(id));
            } else {
                card.setOnMouseClicked(e -> { });
            }

            productsGrid.getChildren().add(card);
        }
    }

    private void addToCart(UUID productId) {
        ProductResponse p = allProducts.stream()
                .filter(x -> productId.equals(x.getId()))
                .findFirst()
                .orElse(null);
        if (p == null || !p.isAvailable()) return;
        if (p.getQuantity() <= 0) {
            new Alert(Alert.AlertType.WARNING, "This product is out of stock.").showAndWait();
            return;
        }
        CartItem existing = cart.get(productId);
        int nextQty = existing != null ? existing.quantity + 1 : 1;
        if (nextQty > p.getQuantity()) {
            new Alert(Alert.AlertType.WARNING, "Not enough stock (max " + p.getQuantity() + ").").showAndWait();
            return;
        }
        cart.put(productId, new CartItem(p, nextQty));
        updateCartDisplay();
    }

    private void updateCartDisplay() {
        cartItemsVBox.getChildren().clear();
        for (CartItem item : cart.values()) {
            HBox row = new HBox(10);
            row.getStyleClass().add("cart-item-row");
            row.setAlignment(javafx.geometry.Pos.CENTER_LEFT);
            row.setPadding(new Insets(10));
            Node thumb = buildProductImageNode(item.product.getImageUrl(), 56, 56, "20px");
            VBox info = new VBox(2);
            HBox.setHgrow(info, Priority.ALWAYS);
            Label name = new Label(item.product.getName());
            name.setStyle("-fx-font-weight: bold;");
            Label codeLine = new Label("Mã SP: " + formatProductCode(item.product.getId()));
            codeLine.setStyle("-fx-font-size: 10px; -fx-text-fill: rgb(107, 114, 128);");
            double lineTotal = item.product.getPrice() != null
                    ? item.product.getPrice().doubleValue() * item.quantity
                    : 0;
            Label total = new Label(String.format("$%.2f", lineTotal));
            total.setStyle("-fx-text-fill: rgb(234, 88, 12); -fx-font-weight: bold;");
            info.getChildren().addAll(name, codeLine, total);
            Button minus = new Button("−");
            minus.setOnAction(e -> updateQty(item.product.getId(), -1));
            Button plus = new Button("+");
            plus.setOnAction(e -> updateQty(item.product.getId(), 1));
            Label qty = new Label(String.valueOf(item.quantity));
            qty.setStyle("-fx-font-weight: bold;");
            HBox controls = new HBox(5);
            controls.setAlignment(javafx.geometry.Pos.CENTER);
            controls.getChildren().addAll(minus, qty, plus);
            row.getChildren().addAll(thumb, info, controls);
            cartItemsVBox.getChildren().add(row);
        }
        updateTotals();
    }

    private void updateQty(UUID productId, int delta) {
        CartItem item = cart.get(productId);
        if (item == null) return;
        ProductResponse p = item.product;
        int newQty = item.quantity + delta;
        if (newQty <= 0) {
            cart.remove(productId);
        } else if (p.getQuantity() > 0 && newQty > p.getQuantity()) {
            new Alert(Alert.AlertType.WARNING, "Not enough stock (max " + p.getQuantity() + ").").showAndWait();
            return;
        } else {
            cart.put(productId, new CartItem(p, newQty));
        }
        updateCartDisplay();
    }

    private void updateTotals() {
        double subtotal = cart.values().stream()
                .mapToDouble(i -> i.product.getPrice() != null
                        ? i.product.getPrice().doubleValue() * i.quantity
                        : 0)
                .sum();
        double total = subtotal;
        subtotalLabel.setText(String.format("$%.2f", subtotal));
        totalLabel.setText(String.format("$%.2f", total));
    }

    /**
     * Styled review dialog: amounts from {@link InvoiceService#createReview}, line items from server, JSON payload.
     *
     * @return true if user confirms payment
     */
    private boolean showInvoiceReviewDialog(
            InvoiceCreationRequest request,
            List<CartItem> snapshot,
            String prettyJson,
            ReviewResponse review
    ) {
        Dialog<ButtonType> dialog = new Dialog<>();
        dialog.setTitle("Xác nhận hóa đơn");
        dialog.setHeaderText(null);
        Window owner = null;
        if (productSearchField != null && productSearchField.getScene() != null) {
            owner = productSearchField.getScene().getWindow();
        }
        dialog.initOwner(owner);

        ButtonType confirmBtn = new ButtonType("Xác nhận thanh toán", ButtonBar.ButtonData.OK_DONE);
        ButtonType cancelBtn = new ButtonType("Hủy", ButtonBar.ButtonData.CANCEL_CLOSE);
        dialog.getDialogPane().getButtonTypes().setAll(confirmBtn, cancelBtn);

        ScrollPane scroll = buildInvoiceReviewContent(request, snapshot, prettyJson, review);
        dialog.getDialogPane().setContent(scroll);
        dialog.getDialogPane().setPrefWidth(560);
        dialog.getDialogPane().setMinHeight(420);
        dialog.getDialogPane().getStyleClass().add("invoice-review-dialog");

        URL css = CashierController.class.getResource("/com/sgu/happycashierscreen/styles.css");
        if (css != null) {
            dialog.getDialogPane().getStylesheets().add(css.toExternalForm());
        }

        Button ok = (Button) dialog.getDialogPane().lookupButton(confirmBtn);
        ok.getStyleClass().add("primary-button");

        Optional<ButtonType> result = dialog.showAndWait();
        return result.isPresent() && result.get() == confirmBtn;
    }

    private ScrollPane buildInvoiceReviewContent(
            InvoiceCreationRequest req,
            List<CartItem> snapshot,
            String prettyJson,
            ReviewResponse review
    ) {
        VBox root = new VBox(14);
        root.getStyleClass().add("invoice-review-root");
        root.setMaxWidth(520);

        HBox hero = new HBox(12);
        hero.setAlignment(Pos.CENTER_LEFT);
        hero.getStyleClass().add("invoice-review-hero");
        Label emoji = new Label("🧾");
        emoji.setStyle("-fx-font-size: 36px;");
        VBox heroText = new VBox(4);
        Label heroTitle = new Label("Kiểm tra trước khi thanh toán");
        heroTitle.getStyleClass().add("invoice-review-hero-title");
        Label heroSub = new Label("Đối chiếu thông tin khách, địa chỉ và từng dòng hàng.");
        heroSub.getStyleClass().add("invoice-review-hero-sub");
        heroText.getChildren().addAll(heroTitle, heroSub);
        hero.getChildren().addAll(emoji, heroText);

        Label payBadge = new Label(formatPaymentBadge(req.getPaymentMethod()));
        payBadge.getStyleClass().add("invoice-review-badge");

        VBox moneyCard = new VBox(10);
        moneyCard.getStyleClass().add("invoice-review-card");
        Label moneyTitle = new Label("Tiền thanh toán (từ máy chủ — createReview)");
        moneyTitle.getStyleClass().add("invoice-review-card-title");
        moneyCard.getChildren().add(moneyTitle);

        BigDecimal totalGross = review != null ? review.getTotalAmount() : null;
        BigDecimal toPay = review != null ? review.getRealAmount() : null;
        BigDecimal discount = null;
        if (totalGross != null && toPay != null) {
            discount = totalGross.subtract(toPay);
        }

        moneyCard.getChildren().add(reviewField("Tổng gốc (trước KM)", formatMoney(totalGross)));
        if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
            moneyCard.getChildren().add(reviewField("Giảm giá (khuyến mãi)", formatMoney(discount)));
        }
        Label payLabel = new Label("Số tiền cần thanh toán: " + formatMoney(toPay));
        payLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: rgb(234, 88, 12);");
        payLabel.setWrapText(true);
        moneyCard.getChildren().add(payLabel);

        VBox infoCard = new VBox(10);
        infoCard.getStyleClass().add("invoice-review-card");
        Label infoTitle = new Label("Thông tin hóa đơn");
        infoTitle.getStyleClass().add("invoice-review-card-title");
        infoCard.getChildren().add(infoTitle);
        infoCard.getChildren().add(reviewField("Nhân viên (Staff ID)", formatUuid(req.getStaffId())));
        String customerName = review != null && review.getCustomerName() != null && !review.getCustomerName().isBlank()
                ? review.getCustomerName()
                : null;
        if (customerName != null) {
            infoCard.getChildren().add(reviewField("Khách hàng", customerName));
        }
        infoCard.getChildren().add(reviewField("Khách hàng (Customer ID)", formatUuid(req.getCustomerId())));
        String shipDisplay = req.getShippingAddress() != null && !req.getShippingAddress().isBlank()
                ? req.getShippingAddress()
                : (review != null && review.getShippingAddress() != null && !review.getShippingAddress().isBlank()
                        ? review.getShippingAddress()
                        : "— (walk-in / tại quầy)");
        infoCard.getChildren().add(reviewField("Địa chỉ giao hàng", shipDisplay));

        VBox linesCard = new VBox(10);
        linesCard.getStyleClass().add("invoice-review-card");
        int lineCount = review != null && review.getReviewDetails() != null
                ? review.getReviewDetails().size()
                : snapshot.size();
        Label linesTitle = new Label("Chi tiết sản phẩm (" + lineCount + ")");
        linesTitle.getStyleClass().add("invoice-review-card-title");
        linesCard.getChildren().add(linesTitle);

        if (review != null && review.getReviewDetails() != null && !review.getReviewDetails().isEmpty()) {
            review.getReviewDetails().stream()
                    .sorted(Comparator.comparing(d -> Optional.ofNullable(d.getProductName()).orElse("")))
                    .forEach(d -> linesCard.getChildren().add(buildInvoiceLineRowFromReview(d)));
        } else {
            double sum = 0;
            for (CartItem item : snapshot) {
                double line = item.product.getPrice() != null
                        ? item.product.getPrice().doubleValue() * item.quantity
                        : 0;
                sum += line;
                linesCard.getChildren().add(buildInvoiceLineRow(item, line));
            }
            HBox totalRow = new HBox();
            totalRow.setAlignment(Pos.CENTER_RIGHT);
            totalRow.setPadding(new Insets(8, 0, 0, 0));
            Label totalLbl = new Label(String.format("Tạm tính (giỏ): $%.2f", sum));
            totalLbl.setStyle("-fx-font-size: 13px; -fx-font-weight: bold; -fx-text-fill: rgb(107, 114, 128);");
            totalRow.getChildren().add(totalLbl);
            linesCard.getChildren().add(totalRow);
        }

        TextArea jsonArea = new TextArea(prettyJson);
        jsonArea.setEditable(false);
        jsonArea.setWrapText(true);
        jsonArea.setPrefRowCount(10);
        jsonArea.getStyleClass().add("invoice-review-json");

        TitledPane jsonPane = new TitledPane("Payload gửi API (JSON)", jsonArea);
        jsonPane.getStyleClass().add("invoice-review-titled-pane");
        jsonPane.setExpanded(false);
        Accordion accordion = new Accordion(jsonPane);

        root.getChildren().addAll(hero, payBadge, moneyCard, infoCard, linesCard, accordion);

        ScrollPane scroll = new ScrollPane(root);
        scroll.setFitToWidth(true);
        scroll.getStyleClass().add("invoice-review-scroll");
        scroll.setMaxHeight(480);
        return scroll;
    }

    private VBox reviewField(String key, String value) {
        VBox box = new VBox(2);
        box.getStyleClass().add("invoice-review-row");
        Label k = new Label(key);
        k.getStyleClass().add("invoice-review-key");
        Label v = new Label(value != null ? value : "—");
        v.getStyleClass().add("invoice-review-val");
        v.setWrapText(true);
        v.setMaxWidth(480);
        box.getChildren().addAll(k, v);
        return box;
    }

    private HBox buildInvoiceLineRow(CartItem item, double lineTotal) {
        HBox row = new HBox(12);
        row.getStyleClass().add("invoice-review-line");
        row.setAlignment(Pos.CENTER_LEFT);
        VBox left = new VBox(4);
        HBox.setHgrow(left, Priority.ALWAYS);
        Label name = new Label(item.product.getName() != null ? item.product.getName() : "(Sản phẩm)");
        name.getStyleClass().add("invoice-review-line-name");
        Label meta = new Label("Mã SP: " + formatProductCode(item.product.getId()) + "  ·  SL: " + item.quantity);
        meta.getStyleClass().add("invoice-review-line-meta");
        left.getChildren().addAll(name, meta);
        Label price = new Label(String.format("$%.2f", lineTotal));
        price.setStyle("-fx-font-weight: bold; -fx-text-fill: rgb(234, 88, 12);");
        row.getChildren().addAll(left, price);
        return row;
    }

    private HBox buildInvoiceLineRowFromReview(ReviewDetailResponse d) {
        HBox row = new HBox(12);
        row.getStyleClass().add("invoice-review-line");
        row.setAlignment(Pos.CENTER_LEFT);
        VBox left = new VBox(4);
        HBox.setHgrow(left, Priority.ALWAYS);
        Label name = new Label(d.getProductName() != null ? d.getProductName() : "(Sản phẩm)");
        name.getStyleClass().add("invoice-review-line-name");
        String metaText = "Mã SP: " + formatProductCode(d.getProductId())
                + "  ·  SL: " + (d.getQuantity() != null ? d.getQuantity() : 0)
                + "  ·  Đơn: " + formatMoney(d.getUnitPrice());
        if (d.getDiscountAmount() != null && d.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            metaText += "  ·  Giảm: " + formatMoney(d.getDiscountAmount());
        }
        Label meta = new Label(metaText);
        meta.getStyleClass().add("invoice-review-line-meta");
        meta.setWrapText(true);
        left.getChildren().addAll(name, meta);
        Label linePay = new Label(formatMoney(d.getTotalPrice() != null && d.getDiscountAmount() != null
                ? d.getTotalPrice().subtract(d.getDiscountAmount())
                : d.getTotalPrice()));
        linePay.setStyle("-fx-font-weight: bold; -fx-text-fill: rgb(234, 88, 12);");
        row.getChildren().addAll(left, linePay);
        return row;
    }

    private static String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "—";
        }
        return String.format("$%.2f", amount.doubleValue());
    }

    private static String formatUuid(UUID id) {
        return id != null ? id.toString() : "—";
    }

    private String formatPaymentBadge(String method) {
        if (PAY_AT_COUNTER.equals(method)) {
            return "Thanh toán: Tiền mặt (COD)";
        }
        if (CARD_LIKE.equals(method)) {
            return "Thanh toán: Thẻ / QR (QR_Scanning)";
        }
        return "Thanh toán: " + method;
    }

    @FXML
    private void processCash() { processPayment(PAY_AT_COUNTER); }

    @FXML
    private void processCard() { processPayment(CARD_LIKE); }

    /**
     * Builds {@link InvoiceCreationRequest}, shows confirmation with full payload, then {@link InvoiceService#createInvoice}.
     *
     * @param paymentMethod server enum name ({@link #PAY_AT_COUNTER} or {@link #CARD_LIKE})
     */
    private void processPayment(String paymentMethod) {
        if (cart.isEmpty()) {
            new Alert(Alert.AlertType.WARNING, "Cart is empty").showAndWait();
            return;
        }

        String shippingRaw = shippingAddressField != null && shippingAddressField.getText() != null
                ? shippingAddressField.getText().trim()
                : "";
        String shippingForRequest = shippingRaw.isBlank() ? null : shippingRaw;

        String customerText = customerIdField != null && customerIdField.getText() != null
                ? customerIdField.getText().trim()
                : "";
        UUID customerId = null;
        if (!customerText.isBlank()) {
            try {
                customerId = UUID.fromString(customerText);
            } catch (IllegalArgumentException e) {
                new Alert(Alert.AlertType.WARNING,
                        "Customer ID must be a valid UUID, or leave empty for walk-in.").showAndWait();
                return;
            }
        }

        List<CartItem> snapshot = new ArrayList<>(cart.values());
        InvoiceCreationRequest request = buildInvoiceCreationRequest(snapshot, paymentMethod, customerId, shippingForRequest);
        ReviewRequest reviewRequest = buildReviewRequest(customerId, shippingForRequest, snapshot);

        final String prettyJson = toPrettyJson(request);

        final InvoiceCreationRequest invoiceRequest = request;
        final ReviewRequest reviewReq = reviewRequest;
        final List<CartItem> cartSnapshot = snapshot;
        final String payMethod = paymentMethod;

        new Thread(() -> {
            try {
                ReviewResponse review = InvoiceService.createReview(reviewReq);
                Platform.runLater(() -> {
                    if (!showInvoiceReviewDialog(invoiceRequest, cartSnapshot, prettyJson, review)) {
                        return;
                    }
                    new Thread(() -> {
                        try {
                            InvoiceResponse invoice = InvoiceService.createInvoice(invoiceRequest);
                            Platform.runLater(() -> {
                                addSalesHistory(cartSnapshot, payMethod);
                                cart.clear();
                                updateCartDisplay();
                                String idText = invoice != null && invoice.getId() != null
                                        ? invoice.getId().toString()
                                        : "(unknown)";
                                new Alert(
                                        Alert.AlertType.INFORMATION,
                                        "Invoice created successfully.\nInvoice ID: " + idText
                                ).showAndWait();
                            });
                        } catch (Exception e) {
                            Platform.runLater(() -> new Alert(
                                    Alert.AlertType.ERROR,
                                    "Failed to create invoice: " + e.getMessage()
                            ).showAndWait());
                        }
                    }, "create-invoice").start();
                });
            } catch (Exception e) {
                Platform.runLater(() -> new Alert(
                        Alert.AlertType.ERROR,
                        "Không thể tạo bản xem trước (createReview): " + e.getMessage()
                ).showAndWait());
            }
        }, "create-review").start();
    }

    private static String toPrettyJson(InvoiceCreationRequest request) {
        try {
            return ObjectMapperUtil.OBJECT_MAPPER
                    .writerWithDefaultPrettyPrinter()
                    .writeValueAsString(request);
        } catch (Exception e) {
            return String.valueOf(request);
        }
    }

    private ReviewRequest buildReviewRequest(UUID customerId, String shippingAddress, List<CartItem> snapshot) {
        List<ReviewDetailRequest> details = snapshot.stream()
                .map(item -> ReviewDetailRequest.builder()
                        .productId(item.product.getId())
                        .quantity(item.quantity)
                        .build())
                .collect(Collectors.toList());
        return ReviewRequest.builder()
                .customerId(customerId)
                .shippingAddress(shippingAddress)
                .details(details)
                .build();
    }

    private InvoiceCreationRequest buildInvoiceCreationRequest(
            List<CartItem> items,
            String paymentMethod,
            UUID customerId,
            String shippingAddress
    ) {
        List<InvoiceDetailCreationRequest> invoiceDetails = items.stream()
                .map(item -> InvoiceDetailCreationRequest.builder()
                        .productId(item.product.getId())
                        .petId(null)
                        .quantity(item.quantity)
                        .build())
                .collect(Collectors.toList());

        UUID staffId = AppState.getStaffUser() != null ? AppState.getStaffUser().getId() : null;
        return InvoiceCreationRequest.builder()
                .staffId(staffId)
                .customerId(customerId)
                .shippingAddress(shippingAddress != null && !shippingAddress.isBlank() ? shippingAddress : null)
                .paymentMethod(paymentMethod)
                .invoiceDetails(invoiceDetails)
                .build();
    }

    /**
     * Opens a dialog to load customers and filter by username; fills customer UUID and optionally address.
     */
    @FXML
    private void openCustomerPicker() {
        Dialog<CustomerResponse> dialog = new Dialog<>();
        dialog.setTitle("Find customer");
        dialog.setHeaderText("Search by username (partial match). Leave search empty to list all.");

        TextField searchField = new TextField();
        searchField.setPromptText("Username contains…");

        ListView<CustomerResponse> listView = new ListView<>();
        listView.setPrefHeight(260);
        listView.setCellFactory(lv -> new ListCell<>() {
            @Override
            protected void updateItem(CustomerResponse c, boolean empty) {
                super.updateItem(c, empty);
                if (empty || c == null) {
                    setText(null);
                } else {
                    String un = (c.getUser() != null && c.getUser().getUsername() != null)
                            ? c.getUser().getUsername()
                            : "?";
                    String fn = c.getUser() != null && c.getUser().getFirstName() != null
                            ? c.getUser().getFirstName()
                            : "";
                    String ln = c.getUser() != null && c.getUser().getLastName() != null
                            ? c.getUser().getLastName()
                            : "";
                    String name = (fn + " " + ln).trim();
                    setText(un + (name.isEmpty() ? "" : " — " + name) + "\n" + c.getId());
                }
            }
        });

        Runnable runSearch = () -> {
            String q = searchField.getText() != null ? searchField.getText().trim().toLowerCase(Locale.ROOT) : "";
            new Thread(() -> {
                try {
                    List<CustomerResponse> all = CustomerService.fetchAllCustomers();
                    List<CustomerResponse> filtered = all.stream()
                            .filter(c -> {
                                if (q.isEmpty()) {
                                    return true;
                                }
                                if (c.getUser() == null || c.getUser().getUsername() == null) {
                                    return false;
                                }
                                return c.getUser().getUsername().toLowerCase(Locale.ROOT).contains(q);
                            })
                            .collect(Collectors.toList());
                    Platform.runLater(() -> {
                        listView.getItems().setAll(filtered);
                        if (filtered.size() == 1) {
                            listView.getSelectionModel().select(0);
                        }
                    });
                } catch (Exception ex) {
                    Platform.runLater(() -> new Alert(Alert.AlertType.ERROR,
                            "Could not load customers: " + ex.getMessage()).showAndWait());
                }
            }, "fetch-customers").start();
        };

        Button searchBtn = new Button("Search");
        searchBtn.setOnAction(e -> runSearch.run());
        searchField.setOnAction(e -> runSearch.run());

        VBox content = new VBox(10,
                new Label("Username:"),
                searchField,
                searchBtn,
                listView);
        content.setPadding(new Insets(10));
        dialog.getDialogPane().setContent(content);

        ButtonType useBtn = new ButtonType("Use selected", ButtonBar.ButtonData.OK_DONE);
        ButtonType cancelBtn = new ButtonType("Cancel", ButtonBar.ButtonData.CANCEL_CLOSE);
        dialog.getDialogPane().getButtonTypes().addAll(useBtn, cancelBtn);

        Button useButtonNode = (Button) dialog.getDialogPane().lookupButton(useBtn);
        useButtonNode.addEventFilter(ActionEvent.ACTION, event -> {
            if (listView.getSelectionModel().getSelectedItem() == null) {
                event.consume();
                new Alert(Alert.AlertType.WARNING, "Select a customer from the list.").showAndWait();
            }
        });

        dialog.setResultConverter(buttonType -> {
            if (buttonType == useBtn) {
                return listView.getSelectionModel().getSelectedItem();
            }
            return null;
        });

        dialog.setOnShown(ev -> runSearch.run());

        Optional<CustomerResponse> picked = dialog.showAndWait();
        picked.ifPresent(c -> {
            if (c.getId() != null && customerIdField != null) {
                customerIdField.setText(c.getId().toString());
            }
            if (shippingAddressField != null && c.getUser() != null
                    && c.getUser().getAddress() != null && !c.getUser().getAddress().isBlank()) {
                shippingAddressField.setText(c.getUser().getAddress());
            }
        });
    }

    private void addSalesHistory(List<CartItem> items, String method) {
        for (CartItem item : items) {
            double unit = item.product.getPrice() != null ? item.product.getPrice().doubleValue() : 0;
            double line = unit * item.quantity;
            AppState.addSale(new AppState.SaleRecord(
                    UUID.randomUUID().toString(),
                    item.product.getName() != null ? item.product.getName() : "",
                    item.quantity,
                    unit,
                    line,
                    new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date()),
                    method
            ));
        }
    }

    @FXML
    private void clearCart() {
        cart.clear();
        updateCartDisplay();
    }

    @FXML
    private void showSalesHistory() throws Exception {
        AppNavigator.showHistory();
    }

    @FXML
    private void showFullHistory() throws Exception {
        AppNavigator.showHistory();
    }

    @FXML
    private void showStaffAccount() {
        var staff = AppState.getStaffUser();
        String msg = staff != null && staff.getUser() != null
                ? staff.getUser().getUsername()
                : "Staff";
        new Alert(Alert.AlertType.INFORMATION, "Staff: " + msg).showAndWait();
    }

    @FXML
    private void handleLogout() throws Exception {
        AppState.setStaffUser(null);
        com.sgu.happycashierscreen.util.ApiClient.clearToken();
        AppNavigator.showLogin();
    }
}
