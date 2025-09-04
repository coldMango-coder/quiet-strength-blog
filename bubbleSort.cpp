#include <iostream>
#include <utility>
using namespace std;

template <typename T>
void BubbleSort(T a[], int n) {
    int i = 1;
    bool sw;
    do {
        sw = false;
        for (int j = 0; j < n - i; ++j) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                sw = true;
            }
        }
        ++i;
    } while (i <= n - 1 && sw);
}

template <typename T>
void print_arr(const T* a, int n) {
    for (int i = 0; i < n; ++i) {
        cout << a[i] << (i + 1 < n ? ' ' : '\n');
    }
}

int main() {
    int n;
    cout << "Unesi n: ";
    if (!(cin >> n) || n < 0) {
        cerr << "Neispravan n.\n";
        return 1;
    }

    int* a = n > 0 ? new int[n] : nullptr;

    if (n > 0) {
        cout << "Unesi " << n << " elemenata: ";
        for (int i = 0; i < n; ++i) cin >> a[i];
    }

    BubbleSort(a, n);

    cout << "Sortirano: ";
    print_arr(a, n);

    delete[] a;
    return 0;
}