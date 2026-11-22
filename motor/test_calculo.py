import unittest
from calculo import custo_com_perda, preco_de_venda, acabador


class TestMotor(unittest.TestCase):

    def test_T1_custo_com_perda(self):
        self.assertAlmostEqual(round(custo_com_perda(500, 0.15), 2), 588.24, places=2)

    def test_T2_perda_vazia_nao_mostra_preco(self):
        r = preco_de_venda(500, None, 120, 40, 60, 30, 0.06, 0.05, 0.25)
        self.assertIsNone(r)

    def test_T3_preco_de_venda_completo(self):
        r = preco_de_venda(500, 0.15, 120, 40, 60, 30, 0.06, 0.05, 0.25)
        self.assertEqual(round(r, 2), 1309.74)

    def test_T4_acabador(self):
        self.assertEqual(round(acabador(10000, 190, 0.05), 2), 490.50)

    def test_divisor_zero_bloqueia(self):
        r = preco_de_venda(500, 0.15, 120, 40, 60, 30, 0.5, 0.3, 0.2)
        self.assertIsNone(r)


if __name__ == "__main__":
    unittest.main()
