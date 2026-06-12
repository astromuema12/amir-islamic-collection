
    </main>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-rc.0/js/select2.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-rc.0/css/select2.min.css" rel="stylesheet">
<script>
$(document).ready(function() {
    $('.select2').select2({ width: '100%' });
    setTimeout(() => $('.alert-dismissible').fadeOut(500), 5000);
    $('[data-confirm]').on('click', function(e) {
        if (!confirm($(this).data('confirm') || 'Are you sure?')) e.preventDefault();
    });
});
</script>
</body>
</html>
