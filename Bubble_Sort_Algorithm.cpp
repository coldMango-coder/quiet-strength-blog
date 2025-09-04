#include <iostream>
#include <utility> // std::swap
using namespace std;

template <typename T>
void BubbleSort(T a[], int n) {
    int i = 1;
    bool sw;
    do {
        sw = false;
        for (int j = 0; j < n - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                sw = true;
            }
        }
        i++;
    } while (i <= n - 1 && sw);
}

int main() {
    int n;
    cout << "Unesi n: ";
    if (!(cin >> n) || n < 0) {
        cerr << "Neispravan n.\n";
        return 1;
    }

    int* a = new int[n]; // new int[0] je dozvoljen
    for (int i = 0; i < n; i++) cin >> a[i];

    BubbleSort(a, n);

    cout << "Sortirano: ";
    for (int i = 0; i < n; i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << '\n';

    delete[] a;
    return 0;
}
